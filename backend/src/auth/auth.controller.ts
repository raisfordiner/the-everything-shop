import Send from "util/response";
import { Request, Response } from "express";
import AuthSchema from "./auth.schema";
import { z } from "zod";
import AuthService from "./auth.service";
import { logger } from "util/logger";

const ONE_MINUTE: number = 60 * 1000; // one minute in milliseconds

export default class AuthController {
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body as z.infer<typeof AuthSchema.register>;

    try {
      const newUser = await AuthService.register(username, email, password);

      return Send.success(
        res,
        { id: newUser.id, username: newUser.username, email: newUser.email },
        "User successfully registered."
      );
    } catch (error: any) {
      if (error.code === "P2002") {
        // P2002 Prisma error code: unique constraint violation
        return Send.error(res, null, "Email already exists.");
      }

      logger.error({ error }, "Registration failed");
      return Send.error(res, null, "Registration failed.");
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body as z.infer<typeof AuthSchema.login>; // request body → fields

    try {
      const { user, accessToken, refreshToken } = await AuthService.login(email, password);

      res.cookie("accessToken", accessToken, {
        httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
        secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS-only cookies
        maxAge: 15 * ONE_MINUTE,
        sameSite: "strict", // Ensures the cookie is sent only with requests from the same site
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * ONE_MINUTE,
        sameSite: "strict",
      });

      return Send.success(res, { id: user.id, username: user.username, email: user.email });
    } catch (error) {
      logger.error({ error }, "Login Failed");
      return Send.error(res, null, "Login failed.");
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (userId) {
        await AuthService.logout(userId);
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return Send.success(res, null, "Logged out successfully.");
    } catch (error) {
      logger.error({ error }, "Logout failed");
      return Send.error(res, null, "Logout failed.");
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const refreshToken = req.cookies.refreshToken;

      const newAccessToken = await AuthService.refreshToken(userId, refreshToken);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * ONE_MINUTE,
        sameSite: "strict",
      });

      return Send.success(res, {
        message: "Access token refreshed successfully",
      });
    } catch (error) {
      logger.error({ error }, "Refresh Token failed");
      return Send.error(res, null, "Failed to refresh token");
    }
  }
}
