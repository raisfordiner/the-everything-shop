import Send from "util/response";
import { Request, Response } from "express";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordWithTokenSchema,
} from "./auth.schema";
import { z } from "zod";
import AuthService from "./auth.service";
import { logger } from "util/logger";
import { sendMail } from "util/mail";

const ONE_MINUTE: number = 60 * 1000; // one minute in milliseconds
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * ONE_MINUTE,
  });

  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 24 * 60 * ONE_MINUTE,
  });
};

export default class AuthController {
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body as z.infer<typeof registerSchema>;

    try {
      const { user, emailVerificationToken } = await AuthService.register(username, email, password);

      await sendMail({
        from: "no-reply@example.com",
        to: email,
        subject: "Email Verification",
        html: `
        <html>
          <body>
            <h1>Email verification needed</h1>
            <p>
              Click the link below to verify your email:
            </p>
            <a href="${process.env.FE_URL}/auth/verify?token=${emailVerificationToken}">
              Verify Email
            </a>
            <p>
              If you did not request this, please ignore this email.
            </p>
          </body>
        </html>`,
      });

      return Send.success(
        res,
        { id: user.id, username: user.username, email: user.email },
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

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body as z.infer<typeof forgotPasswordSchema>;

    try {
      const { user, resetPasswordToken } = await AuthService.forgotPassword(email);

      // Send email only if user exists (don't leak information)
      if (user && resetPasswordToken) {
        await sendMail({
          from: "no-reply@example.com",
          to: email,
          subject: "Password Reset Request",
          html: `
          <html>
            <body>
              <h1>Password Reset Request</h1>
              <p>
                Click the link below to reset your password:
              </p>
              <a href="${process.env.FE_URL}/reset-password?token=${resetPasswordToken}">
                Reset Password
              </a>
              <p>
                This link expires in 15 minutes.
              </p>
              <p>
                If you did not request this, please ignore this email.
              </p>
            </body>
          </html>`,
        });
      }

      // Always return same message (don't leak whether email exists)
      return Send.success(res, { email }, "If an account exists with this email, a password reset link has been sent.");
    } catch (error: any) {
      logger.error({ error }, "Forgot password failed.");
      return Send.error(res, null, error.message || "Forgot password failed.");
    }
  }



  static async verify(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return Send.error(res, null, "Invalid or missing token.");
      }

      const { user, accessToken, refreshToken } = await AuthService.verifyEmailToken(token);

      setAuthCookies(res, accessToken, refreshToken);

      return Send.success(
        res,
        { id: user.id, username: user.username, email: user.email, emailVerified: user.emailVerified },
        "Email verified successfully. You have been logged in."
      );
    } catch (error: any) {
      logger.error({ error }, "Email verification failed.");
      return Send.error(res, null, error.message || "Email verification failed.");
    }
  }

  static async reset(req: Request, res: Response) {
    const { token, new_password } = req.body as z.infer<typeof resetPasswordWithTokenSchema>;

    try {
      const user = await AuthService.resetPasswordWithToken(token, new_password);

      return Send.success(
        res,
        { id: user.id, email: user.email },
        "Password reset successfully. You can now login with your new password."
      );
    } catch (error: any) {
      logger.error({ error }, "Password reset failed.");
      return Send.error(res, null, error.message || "Password reset failed.");
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body as z.infer<typeof loginSchema>;

    try {
      const { user, accessToken, refreshToken } = await AuthService.login(email, password);

      setAuthCookies(res, accessToken, refreshToken);

      return Send.success(res, { id: user.id, username: user.username, email: user.email, role: user.role });
    } catch (error: any) {
      logger.error({ error }, "Login Failed");
      return Send.error(res, null, error.message || "Login failed.");
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return Send.error(res, null, "Unauthorized.");
      }

      await AuthService.logout(userId);
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
      const userId = (req as any).user?.userId;
      const refreshToken = req.cookies.refreshToken;

      if (!userId) {
        return Send.error(res, null, "Unauthorized.");
      }

      const newAccessToken = await AuthService.refreshToken(userId, refreshToken);

      res.cookie("accessToken", newAccessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * ONE_MINUTE,
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
