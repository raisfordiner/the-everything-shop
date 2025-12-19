import pino from "pino";

// Create a logging instance
const loggerInstance = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      }
      : undefined,
});

export const logger = loggerInstance;
