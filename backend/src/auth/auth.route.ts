import AuthController from "./auth.controller";
import AuthSchema from "./auth.schema";
import AuthMiddleware from "./auth.middleware";

import validateBody from "util/validation";
import BaseRouter, { RouteConfig } from "util/router";

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
