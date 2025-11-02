import { Router, RequestHandler } from "express";

type RouteMethod = "get" | "post" | "put" | "delete" | "patch";

export interface RouteConfig {
  method: RouteMethod;
  path: string;
  controller: RequestHandler;
  middlewares?: RequestHandler[]; // optional
}

export default abstract class BaseRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  // Abstract method that must be implemented by subclasses to define the routes
  protected abstract routes(): RouteConfig[];

  private registerRoutes(): void {
    this.routes().forEach(
      ({ method, path, controller: handler, middlewares = [] }) => {
        this.router[method](path, ...middlewares, handler);
      }
    );
  }
}
