import authConfig from "config/auth.config";
import Send from "util/response";
import { logger } from "util/logger";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface DecodedToken {
  userId: string;
}

export default class AuthMiddleware {
  static authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return Send.unauthorized(res, null); // can't find token, unauthorized user
    }

    try {
      const decodedToken = jwt.verify(token, authConfig.secret) as DecodedToken;

      (req as any).user = { userId: decodedToken.userId };

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
      const decodedToken = jwt.verify(refreshToken, authConfig.refresh_secret) as { userId: string };

      (req as any).user = { userId: decodedToken.userId };

      next();
    } catch (error) {
      // token is invalid or expired
      logger.error({ error }, "Refresh Token authentication failed");
      return Send.unauthorized(res, {
        message: "Invalid or expired refresh token",
      });
    }
  };
}
