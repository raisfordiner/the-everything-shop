import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import Send from "./response";

const unknownEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const message = "Endpoint not found";

  logger.warn(
    `404 - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  Send.notFound(res, null, message);
};

export default unknownEndpoint;
