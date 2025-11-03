import express, { Express } from "express";

import cors from "cors";
import morgan from "morgan"; // HTTP request logger
import cookieParser from "cookie-parser"; // parse Cookie header
import helmet from "helmet"; // set security-related HTTP headers
import compression from "compression"; // gzip the response
import { specs, swaggerUi } from "./util/swagger";

import errorHandler from "./util/error";
import unknownEndpoint from "./util/unknownEndpoint";

import appConfig from "config/app.config";

import authRoute from "auth/auth.route";
import userRoute from "user/user.route";

import { logger } from "util/logger";

export default class App {
  private app: Express;

  constructor() {
    this.app = express();

    this.initMiddlewares();
    this.initRoutes();
  }

  private initMiddlewares() {
    this.app.set("trust proxy", 1);

    this.app.use(express.json());
    this.app.use(cookieParser());

    this.app.use(
      cors({
        origin: [
          "http://localhost:3000", // frontend url
          "https://mywebsite.com", // production url optional
        ],
        methods: ["GET", "POST", "DELETE"],
        credentials: true,
      })
    );

    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(compression());

    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initRoutes() {
    this.app.use("/api/auth", authRoute); // /api/auth/*
    this.app.use("/api/user", userRoute); // /api/user/*

    this.app.get("/error", (req, res) => {
      throw new Error("Test error"); // Test route to trigger error
    });

    this.app.use(unknownEndpoint);
    this.app.use(errorHandler);
  }

  public start() {
    const { port, host } = appConfig;

    this.app.listen(port, host, (error: any) => {
      if (error) throw error;

      logger.info(`server is running on http://${host}:${port}`);
    });
  }
}
