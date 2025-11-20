import AuthController from "./auth.controller";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  resetPasswordWithTokenSchema,
} from "./auth.schema";
import AuthMiddleware from "./auth.middleware";

import { validateBody } from "util/validation";
import BaseRouter, { RouteConfig } from "util/router";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - password_confirmation
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *                 pattern: '^[a-zA-Z0-9_-]+$'
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *                 example: Password123!
 *               password_confirmation:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid request body or validation error
 *       500:
 *         description: Registration failed
 *
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful. Sets accessToken and refreshToken cookies
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=xxx; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 *
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful. Clears accessToken and refreshToken cookies
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Logout failed
 *
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Access token refreshed successfully. Sets new accessToken cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Failed to refresh token
 *
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset (unauthenticated)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: If account exists, password reset email sent. Always returns same message for security.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid email format
 *       500:
 *         description: Forgot password failed
 *
 * /auth/change-password:
 *   put:
 *     summary: Change password (authenticated user)
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *               - password_confirmation
 *             properties:
 *               old_password:
 *                 type: string
 *                 minLength: 8
 *                 example: OldPassword123!
 *               new_password:
 *                 type: string
 *                 minLength: 8
 *                 example: NewPassword123!
 *               password_confirmation:
 *                 type: string
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid request or passwords don't match
 *       401:
 *         description: Unauthorized or old password incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Change password failed
 *
 * /auth/verify:
 *   get:
 *     summary: Verify email with token (after registration or password reset)
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token sent via email
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Email verified successfully. User can now login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 emailVerified:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid or missing token
 *       401:
 *         description: Token expired or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Email verification failed
 *
 * /auth/reset:
 *   post:
 *     summary: Reset password with token (from forgot-password email)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - new_password
 *               - password_confirmation
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token from email
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               new_password:
 *                 type: string
 *                 minLength: 8
 *                 example: NewPassword123!
 *               password_confirmation:
 *                 type: string
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid request or passwords don't match
 *       401:
 *         description: Token expired or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Password reset failed
 */

class AuthRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "post",
        path: "/register", // register, then verify
        middlewares: [validateBody(registerSchema)],
        controller: AuthController.register,
      },
      {
        method: "get",
        path: "/verify",
        middlewares: [], // GET with query param, no body validation needed
        controller: AuthController.verify,
      },
      {
        method: "post",
        path: "/login",
        middlewares: [validateBody(loginSchema)],
        controller: AuthController.login,
      },
      {
        method: "post",
        path: "/logout",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: AuthController.logout,
      },
      {
        method: "post",
        path: "/refresh-token",
        middlewares: [AuthMiddleware.refreshTokenValidation],
        controller: AuthController.refreshToken,
      },
      {
        method: "put",
        path: "/change-password",
        middlewares: [AuthMiddleware.authenticateUser, validateBody(changePasswordSchema)],
        controller: AuthController.changePassword,
      },
      {
        method: "post",
        path: "/forgot-password", // forgot, then reset
        middlewares: [validateBody(forgotPasswordSchema)],
        controller: AuthController.forgotPassword,
      },
      {
        method: "post",
        path: "/reset",
        middlewares: [validateBody(resetPasswordWithTokenSchema)],
        controller: AuthController.reset,
      },
    ];
  }
}

export default new AuthRouter().router;
