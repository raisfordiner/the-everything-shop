import AuthController from "./auth.controller";
import BaseRouter, { RouteConfig } from "util/router";
import ValidationMiddleware from "util/validation";
import authSchema from "./auth.schema";
import AuthMiddleware from "./auth.middleware";

class AuthRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "post",
        path: "/login",
        middlewares: [ValidationMiddleware.validateBody(authSchema.login)],
        controller: AuthController.login,
      },
      {
        method: "post",
        path: "/register",
        middlewares: [ValidationMiddleware.validateBody(authSchema.register)],
        controller: AuthController.register,
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
