import Send from "util/response";
import { Request, Response } from "express";
import { loginSchema, registerSchema, resetPasswordSchema } from "./auth.schema";
import { z } from "zod";
import AuthService from "./auth.service";
import { logger } from "util/logger";
import { sendMail } from "util/mail";

const ONE_MINUTE: number = 60 * 1000; // one minute in milliseconds

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
            <a href="put_url_here/verify?token=${emailVerificationToken}">
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

  static async resetPassword(req: Request, res: Response) {
    const { email, old_password, new_password } = req.body as z.infer<typeof resetPasswordSchema>;

    try {
      const { user, resetPasswordToken } = await AuthService.resetPassword(email, old_password, new_password);

      // res.cookie("resetPasswordToken", resetPasswordToken, {
      //   httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
      //   secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS-only cookies
      //   maxAge: 15 * ONE_MINUTE,
      //   sameSite: "strict", // Ensures the cookie is sent only with requests from the same site
      // });

      await sendMail({
        from: "no-reply@example.com",
        to: email,
        subject: "Password Reset Verification",
        html: `
        <html>
          <body>
            <h1>Password Reset Request</h1>
            <p>
              Click the link below to verify your password reset request:
            </p>
            <a href="put_url_here/verify?token=${resetPasswordToken}">
              Verify Password Reset
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
        "Reset password successfully."
      );
    } catch (error: any) {
      logger.error({ error }, "Reset password failed.");
      return Send.error(res, null, "Reset password failed.");
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return Send.error(res, null, "Invalid or missing token.");
      }

      const user = await AuthService.verifyEmailToken(token);

      return Send.success(
        res,
        { id: user.id, username: user.username, email: user.email, emailVerified: user.emailVerified },
        "Email verified successfully."
      );
    } catch (error: any) {
      logger.error({ error }, "Email verification failed.");
      return Send.error(res, null, error.message || "Email verification failed.");
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body as z.infer<typeof loginSchema>; // request body → fields

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
