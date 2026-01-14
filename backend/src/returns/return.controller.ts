import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import ReturnService from "./return.service";
import { ReturnStatus } from "@prisma/client";

export default class ReturnController {
  static async getReturns(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q, orderId, status } = req.query;

      const result = await ReturnService.find(id, q as string, orderId as string, status as ReturnStatus);

      if (!result) {
        return Send.notFound(res, {}, id ? "Return not found" : "Returns not found");
      }

      const response = id ? { return: result } : { returns: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching returns");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createReturn(req: Request, res: Response) {
    try {
      const { orderId, reason } = req.body;

      const returnItem = await ReturnService.create({
        orderId,
        reason,
      });

      return Send.success(res, { return: returnItem }, "Return created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating return");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  /**
   * Customer-facing endpoint to request return
   */
  static async createCustomerReturnRequest(req: Request, res: Response) {
    try {
      const { orderId, reason } = req.body;
      const customerId = (req as any).user?.id;

      if (!customerId) {
        return Send.unauthorized(res, {}, "Authentication required");
      }

      const returnItem = await ReturnService.createCustomerRequest({
        orderId,
        reason,
        customerId,
      });

      return Send.success(res, { return: returnItem }, "Return request submitted successfully");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to submit return request";
      logger.error({ errorMessage, error: error?.toString() }, "Error creating customer return request");
      return Send.badRequest(res, {}, errorMessage);
    }
  }

  static async withdrawCustomerRequest(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const customerId = (req as any).user?.id;

      if (!customerId) {
        return Send.unauthorized(res, {}, "Authentication required");
      }

      await ReturnService.withdrawCustomerRequest(orderId, customerId);

      return Send.success(res, {}, "Return request withdrawn successfully");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to withdraw return request";
      logger.error({ errorMessage, error: error?.toString() }, "Error withdrawing return request");
      return Send.badRequest(res, {}, errorMessage);
    }
  }

  static async updateReturn(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason, status } = req.body;

      const returnItem = await ReturnService.update(id, {
        reason,
        status,
      });

      return Send.success(res, { return: returnItem }, "Return updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating return");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteReturn(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await ReturnService.delete(id);

      return Send.success(res, {}, "Return deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting return");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
