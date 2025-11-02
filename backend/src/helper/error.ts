import { logger } from "../util/logger";

class ErrorHandler extends Error {
  status: string;
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();

    this.status = "error";
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;

  logger.error(err);

  res.status(statusCode || 500).json({
    status: "error",
    statusCode: statusCode || 500,
    message: statusCode === 500 ? "An error occurred" : message,
  });
};

export { ErrorHandler, handleError };
