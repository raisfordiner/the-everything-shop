import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import CouponsService from "./coupons.service";

export default class CouponsController {
  static async getCoupons(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q, promotionId } = req.query;

      const result = await CouponsService.find(id, q as string, promotionId as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Coupon not found" : "Coupons not found");
      }

      const response = id ? { coupon: result } : { coupons: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching coupons");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createCoupon(req: Request, res: Response) {
    try {
      const { promotionId, code, discountPercentage, maxUsage } = req.body;

      const coupon = await CouponsService.create({
        promotionId,
        code,
        discountPercentage,
        maxUsage,
      });

      return Send.success(res, { coupon }, "Coupon created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating coupon");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateCoupon(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { promotionId, code, discountPercentage, maxUsage, usageCount } = req.body;

      const coupon = await CouponsService.update(id, {
        promotionId,
        code,
        discountPercentage,
        maxUsage,
        usageCount,
      });

      return Send.success(res, { coupon }, "Coupon updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating coupon");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteCoupon(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await CouponsService.delete(id);

      return Send.success(res, {}, "Coupon deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting coupon");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
