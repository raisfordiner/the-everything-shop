import express from "express";
import route from "./routes";
import { handleError } from "./helper/error";
import unknownEndpoint from "./middleware/unknownEndpoint";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { specs, swaggerUi } from "./swagger";

const appInstance = express();

appInstance.set("trust proxy", 1);
appInstance.use(cors({ credentials: true, origin: true }));
appInstance.use(express.json());
appInstance.use(morgan("dev"));
appInstance.use(cookieParser());
appInstance.use(helmet());
appInstance.use(compression());
appInstance.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

appInstance.use("/", route);

appInstance.use(unknownEndpoint);
appInstance.use(handleError);

export default appInstance;
