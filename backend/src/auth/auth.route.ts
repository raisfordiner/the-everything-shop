import AuthController from "./auth.controller";
import AuthSchema from "./auth.schema";
import AuthMiddleware from "./auth.middleware";

import validateBody from "util/validation";
import BaseRouter, { RouteConfig } from "util/router";

// Swagger documentation for Auth API
/**
 * @swagger
 * paths:
 *   /auth/register:
 *     post:
 *       summary: Register a new user
 *       description: Creates a new user account.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterRequest'
 *       responses:
 *         '201':
 *           description: User registered successfully
 *         '400':
 *           description: Invalid request body
 *   /auth/login:
 *     post:
 *       summary: Login a user
 *       description: Authenticates a user and returns an access token.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginRequest'
 *       responses:
 *         '200':
 *           description: Login successful
 *         '401':
 *           description: Invalid credentials
 *   /auth/logout:
 *     post:
 *       summary: Logout a user
 *       description: Logs out the authenticated user.
 *       responses:
 *         '200':
 *           description: Logout successful
 *         '401':
 *           description: Unauthorized
 *   /auth/refresh-token:
 *     post:
 *       summary: Refresh access token
 *       description: Refreshes the access token using a valid refresh token.
 *       responses:
 *         '200':
 *           description: Token refreshed successfully
 *         '401':
 *           description: Invalid or expired refresh token
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 */

class AuthRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "post",
        path: "/register",
        middlewares: [validateBody(AuthSchema.register)],
        controller: AuthController.register,
      },
      {
        method: "post",
        path: "/login",
        middlewares: [validateBody(AuthSchema.login)],
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
