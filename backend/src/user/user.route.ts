import BaseRouter, { RouteConfig } from "util/router";
import AuthMiddleware from "auth/auth.middleware";
import UserController from "./user.controller";
import multer from 'multer';

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for PFP
  },
});

class UserRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/info", // api/user/info
        middlewares: [AuthMiddleware.authenticateUser],
        controller: UserController.getUser,
      },
      {
        method: "put",
        path: "/info",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: UserController.updateUser,
      },
      {
        method: "get",
        path: "/pfp",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: UserController.getPfp,
      },
      {
        method: "post",
        path: "/pfp",
        middlewares: [AuthMiddleware.authenticateUser, upload.single('file')],
        controller: UserController.uploadPfp,
      },
    ];
  }
}

export default new UserRoutes().router;
