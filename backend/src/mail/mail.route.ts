import { adminGuard, authGuard } from "middlewares/authGuard";
import BaseRouter, { RouteConfig } from "util/router";
import { validateQuery } from "util/validation";
import { MailSchema } from "./mail.schema";
import MailController from "./mail.controller";

class UserRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAdmin = [authGuard, adminGuard];

    return [
      {
        method: "post",
        path: "/mail", // api/mail
        middlewares: [...checkIfAdmin, validateQuery(MailSchema)],
        controller: MailController.postMail,
      },
    ];
  }
}

export default new UserRoutes().router;
