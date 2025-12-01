import Send from "util/response";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const field = err.path.join(".");
          formattedErrors[field] = formattedErrors[field] || [];
          formattedErrors[field].push(err.message);
        });

        Send.validationErrors(res, formattedErrors);
        return;
      }

      Send.error(res, "Invalid request data");
      return;
    }
  };
}

function validateQuery(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const field = err.path.join(".");
          formattedErrors[field] = formattedErrors[field] || [];
          formattedErrors[field].push(err.message);
        });

        Send.validationErrors(res, formattedErrors);
        return;
      }

      Send.error(res, "Invalid query data");
      return;
    }
  };
}

export { validateBody, validateQuery };
