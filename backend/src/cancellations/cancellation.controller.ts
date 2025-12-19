import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import CancellationService from "./cancellation.service";
import { CancellationStatus } from "@prisma/client";

export default class CancellationController {
  static async getCancellations(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q, orderId, status } = req.query;

      const result = await CancellationService.find(id, q as string, orderId as string, status as CancellationStatus);

      if (!result) {
        return Send.notFound(res, {}, id ? "Cancellation not found" : "Cancellations not found");
      }

      const response = id ? { cancellation: result } : { cancellations: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching cancellations");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createCancellation(req: Request, res: Response) {
    try {
      const { orderId, reason } = req.body;

      const cancellation = await CancellationService.create({
        orderId,
        reason,
      });

      return Send.success(res, { cancellation }, "Cancellation created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating cancellation");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateCancellation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason, status } = req.body;

      const cancellation = await CancellationService.update(id, {
        reason,
        status,
      });

      return Send.success(res, { cancellation }, "Cancellation updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating cancellation");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteCancellation(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await CancellationService.delete(id);

      return Send.success(res, {}, "Cancellation deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting cancellation");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
