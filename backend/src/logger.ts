import pino from "pino";

// Create a logging instance
const loggerInstance = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export const logger = loggerInstance;
