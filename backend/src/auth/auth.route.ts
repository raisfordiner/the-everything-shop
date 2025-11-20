import AuthController from "./auth.controller";
import { loginSchema, registerSchema, resetPasswordSchema } from "./auth.schema";
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
 * /auth/reset-password:
 *   put:
 *     summary: Reset user password
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
 *               - email
 *               - old_password
 *               - new_password
 *               - password_confirmation
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
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
 *         description: Password reset successful. Verification email sent
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
 *         description: Invalid request or old password does not match
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Reset password failed
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
 */

class AuthRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "post",
        path: "/register",
        middlewares: [validateBody(registerSchema)],
        controller: AuthController.register,
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
        middlewares: [AuthMiddleware.authenticateUser], // check if user is logged in
        controller: AuthController.logout,
      },
      {
        method: "post",
        path: "/refresh-token",
        middlewares: [AuthMiddleware.refreshTokenValidation], // checks if refresh token is valid
        controller: AuthController.refreshToken,
      },
      {
        method: "post",
        path: "/reset-password",
        middlewares: [AuthMiddleware.authenticateUser, validateBody(resetPasswordSchema)], // đã đăng nhập và muốn reset
        controller: AuthController.resetPassword,
      },
      {
        method: "get",
        path: "/verify",
        middlewares: null, // verify refresh token
        controller: AuthController.verify,
      },
    ];
  }
}

export default new AuthRouter().router;
