import express, { Express } from "express";

import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { specs, swaggerUi } from "./util/swagger";

import { handleError } from "./util/error";
import unknownEndpoint from "./middleware/unknownEndpoint";

import appConfig from "config/app.config";

import authRoute from "auth/auth.route";
import userRoute from "user/user.route";

import { logger } from "util/logger";

export default class App {
  private app: Express;

  constructor() {
    this.app = express();

    // Initiate routes first
    // so that any unknown route can be catched
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
          "http://localhost:3000", // your frontend url
          "https://mywebsite.com", // your production url optional
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
    // this.app.get("/", (req: any, res: any) => {
    //   res
    //     .status(200)
    //     .json({ message: "Sample endpoint is working", status: "ok" });
    // });

    this.app.use("/api/auth", authRoute); // /api/auth/*
    this.app.use("/api/user", userRoute); // /api/user/*

    // this.app.use(unknownEndpoint);
    // this.app.use(handleError);
  }

  public start() {
    const { port, host } = appConfig;

    this.app.listen(port, host, (error: any) => {
      if (error) throw error;

      logger.info(`server is running on http://${host}:${port}`);
    });
  }
}
