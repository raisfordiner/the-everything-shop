import authConfig from "config/auth.config";
import Send from "util/response";
import { logger } from "util/logger";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// General role-based guard factory
const roleGuard = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return Send.unauthorized(res, null); // can't find token, unauthorized user
    }
    try {
      const decodedToken = jwt.verify(token, authConfig.secret) as { userId: number; role: string };

      if (!allowedRoles.includes(decodedToken.role)) {
        return Send.unauthorized(res, { message: `Access required: ${allowedRoles.join(" or ")}` });
      }

      next();
    } catch (error) {
      // token is invalid or expired
      logger.error({ error }, "Authentication failed");
      return Send.unauthorized(res, null);
    }
  };
};

// Export specific guards using the factory
export const adminGuard = roleGuard(["ADMIN"]);
export const sellerGuard = roleGuard(["SELLER"]);
export const adminOrSellerGuard = roleGuard(["ADMIN", "SELLER"]);

// General authentication guard
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return Send.unauthorized(res, null); // can't find token, unauthorized user
  }
  try {
    jwt.verify(token, authConfig.secret);
    next();
  } catch (error) {
    // token is invalid or expired
    logger.error({ error }, "Authentication failed");
    return Send.unauthorized(res, null);
  }
};