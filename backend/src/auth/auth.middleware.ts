import authConfig from "config/auth.config";
import Send from "util/response";
import { logger } from "util/logger";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "util/db";
import { UserRole } from "@prisma/client";

export interface DecodedToken {
  userId: number;
}

export default class AuthMiddleware {
  static authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return Send.unauthorized(res, null); // can't find token, unauthorized user
    }

    try {
      const decodedToken = jwt.verify(token, authConfig.secret) as DecodedToken;

      (req as any).userId = decodedToken.userId;

      next();
    } catch (error) {
      // token is invalid or expired
      logger.error({ error }, "Authentication failed");
      return Send.unauthorized(res, null);
    }
  };

  static refreshTokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return Send.unauthorized(res, { message: "No refresh token provided" });
    }

    try {
      const decodedToken = jwt.verify(refreshToken, authConfig.refresh_secret) as { userId: number };

      (req as any).userId = decodedToken.userId;

      next();
    } catch (error) {
      // token is invalid or expired
      logger.error({ error }, "Refresh Token authentication failed");
      return Send.unauthorized(res, {
        message: "Invalid or expired refresh token",
      });
    }
  };

  static requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return Send.unauthorized(res, null);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user || user.role !== UserRole.ADMIN) {
        return Send.forbidden(res, { message: "Admin access required" });
      }

      next();
    } catch (error) {
      logger.error({ error }, "Admin check failed");
      return Send.error(res, {}, "Internal server error");
    }
  };
}
