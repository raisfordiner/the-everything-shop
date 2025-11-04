import BaseRouter, { RouteConfig } from "util/router";

class HealthRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/health",
        middlewares: [],
        controller: (req, res) => {
          res.json({ status: "ok", timestamp: new Date().toISOString() });
        },
      },
    ];
  }
}

export default new HealthRouter().router;
