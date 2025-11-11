import AuthController from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schema";
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
    ];
  }
}

export default new AuthRouter().router;
