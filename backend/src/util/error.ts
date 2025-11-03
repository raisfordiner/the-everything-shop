import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import Send from "./response";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  Send.error(
    res,
    {
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
    message
  );
}
