import BaseRouter, { RouteConfig } from "util/router";
import AuthMiddleware from "auth/auth.middleware";
import UserController from "./user.controller";

class UserRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/info", // api/user/info
        middlewares: [AuthMiddleware.authenticateUser],
        controller: UserController.getUser,
      },
    ];
  }
}

export default new UserRoutes().router;
