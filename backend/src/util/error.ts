import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import Send from "./response";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error
  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  // Send structured error response
  Send.error(
    res,
    {
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
    message
  );
};

export default errorHandler;
