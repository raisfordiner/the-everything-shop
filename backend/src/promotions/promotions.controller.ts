import { Request, Response } from "express";
import Send from "util/response";
import PromotionService from "./promotions.service";
import PromotionSchema, {
  CreatePromotionRequest,
  UpdatePromotionRequest,
  GetAllPromotionsQuery,
  ApplyProductsRequest,
  ApplyCategoriesRequest,
  CreateCouponRequest,
  CreateClearanceEventRequest,
} from "./promotions.schema";
import { logger } from "util/logger";
import { prisma } from "util/db";
import jwt from "jsonwebtoken";
import authConfig from "config/auth.config";

export default class PromotionController {
  /**
   * Helper function to extract userId and role from JWT token
   */
  private static getTokenData(req: Request): { userId: string; role: string } {
    const token = req.cookies.accessToken;
    const decodedToken = jwt.verify(token, authConfig.secret) as { userId: string; role: string };
    return { userId: decodedToken.userId, role: decodedToken.role };
  }

  /**
   * Get all promotions with optional filtering and pagination
   * GET /promotions?skip=0&take=10&status=ACTIVE&search=xxx
   */
  static async getAllPromotions(req: Request, res: Response) {
    try {
      const queryValidation = PromotionSchema.getAllPromotionsQuery.safeParse(req.query);

      if (!queryValidation.success) {
        const errors = queryValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { skip, take, status, search } = queryValidation.data as GetAllPromotionsQuery;

      const result = await PromotionService.getAllPromotions(skip, take, status, search);

      return Send.success(res, result, "Promotions fetched successfully");
    } catch (error) {
      logger.error({ error }, "Failed to fetch promotions");
      return Send.error(res, null, "Failed to fetch promotions");
    }
  }

  /**
   * Get a single promotion by ID
   * GET /promotions/:id
   */
  static async getPromotionById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const promotion = await PromotionService.getPromotionById(id);

      return Send.success(res, promotion, "Promotion fetched successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to fetch promotion");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      return Send.error(res, null, "Failed to fetch promotion");
    }
  }

  /**
   * Create a new promotion (Admin only)
   * POST /promotions
   */
  static async createPromotion(req: Request, res: Response) {
    try {
      const bodyValidation = PromotionSchema.createPromotion.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const {
        name,
        description,
        startDate,
        endDate,
        status,
        appliedProducts,
        appliedCategories,
        coupons,
        clearanceEvents,
      } = bodyValidation.data as CreatePromotionRequest;

      // Get userId from token (already validated by adminGuard middleware)
      const { userId } = PromotionController.getTokenData(req);

      // Get admin profile for the user
      const admin = await prisma.admin.findUnique({
        where: { userId },
      });

      if (!admin) {
        return Send.forbidden(res, null, "Admin profile not found");
      }

      const promotion = await PromotionService.createPromotion(
        name,
        description,
        new Date(startDate),
        new Date(endDate),
        admin.id,
        status,
        appliedProducts,
        appliedCategories,
        coupons,
        clearanceEvents
      );

      return Send.success(res, promotion, "Promotion created successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to create promotion");

      if (error.message.includes("not found")) {
        return Send.badRequest(res, null, error.message);
      }

      return Send.error(res, null, "Failed to create promotion");
    }
  }

  /**
   * Update a promotion (Admin only)
   * PUT /promotions/:id
   */
  static async updatePromotion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = PromotionSchema.updatePromotion.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const updateData = bodyValidation.data as UpdatePromotionRequest;

      // Convert dates if present
      const updatePayload: any = {
        ...updateData,
      };

      if (updateData.startDate) {
        updatePayload.startDate = new Date(updateData.startDate);
      }

      if (updateData.endDate) {
        updatePayload.endDate = new Date(updateData.endDate);
      }

      // Remove applied products and categories from update payload (use separate endpoints)
      delete updatePayload.appliedProducts;
      delete updatePayload.appliedCategories;

      const promotion = await PromotionService.updatePromotion(id, updatePayload);

      return Send.success(res, promotion, "Promotion updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to update promotion");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      return Send.error(res, null, "Failed to update promotion");
    }
  }

  /**
   * Delete a promotion (Admin only)
   * DELETE /promotions/:id
   */
  static async deletePromotion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await PromotionService.deletePromotion(id);

      return Send.success(res, result, "Promotion deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to delete promotion");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      return Send.error(res, null, "Failed to delete promotion");
    }
  }

  /**
   * Apply products to a promotion (Admin only)
   * POST /promotions/:id/products
   */
  static async applyProducts(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = PromotionSchema.applyProductsSchema.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { productIds } = bodyValidation.data as ApplyProductsRequest;

      const promotion = await PromotionService.applyProducts(id, productIds);

      return Send.success(res, promotion, "Products applied to promotion successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to apply products");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      if (error.message.includes("not found")) {
        return Send.badRequest(res, null, error.message);
      }

      return Send.error(res, null, "Failed to apply products");
    }
  }

  /**
   * Apply categories to a promotion (Admin only)
   * POST /promotions/:id/categories
   */
  static async applyCategories(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = PromotionSchema.applyCategoriesSchema.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { categoryIds } = bodyValidation.data as ApplyCategoriesRequest;

      const promotion = await PromotionService.applyCategories(id, categoryIds);

      return Send.success(res, promotion, "Categories applied to promotion successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to apply categories");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      if (error.message.includes("not found")) {
        return Send.badRequest(res, null, error.message);
      }

      return Send.error(res, null, "Failed to apply categories");
    }
  }

  /**
   * Remove products from a promotion (Admin only)
   * DELETE /promotions/:id/products
   */
  static async removeProducts(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = PromotionSchema.applyProductsSchema.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { productIds } = bodyValidation.data as ApplyProductsRequest;

      const promotion = await PromotionService.removeProducts(id, productIds);

      return Send.success(res, promotion, "Products removed from promotion successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to remove products");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      return Send.error(res, null, "Failed to remove products");
    }
  }

  /**
   * Remove categories from a promotion (Admin only)
   * DELETE /promotions/:id/categories
   */
  static async removeCategories(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = PromotionSchema.applyCategoriesSchema.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { categoryIds } = bodyValidation.data as ApplyCategoriesRequest;

      const promotion = await PromotionService.removeCategories(id, categoryIds);

      return Send.success(res, promotion, "Categories removed from promotion successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to remove categories");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      return Send.error(res, null, "Failed to remove categories");
    }
  }

  /**
   * Add coupon to promotion (Admin only)
   * POST /promotions/:id/coupons
   */
  static async addCoupon(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = PromotionSchema.createCouponSchema.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { code, discountPercentage, maxUsage } = bodyValidation.data as CreateCouponRequest;

      const promotion = await PromotionService.addCoupon(id, code, discountPercentage, maxUsage);

      return Send.success(res, promotion, "Coupon added to promotion successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to add coupon");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      if (error.code === "P2002") {
        return Send.badRequest(res, null, "Coupon code already exists");
      }

      return Send.error(res, null, "Failed to add coupon");
    }
  }

  /**
   * Add clearance event to promotion (Admin only)
   * POST /promotions/:id/clearance-events
   */
  static async addClearanceEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = PromotionSchema.createClearanceEventSchema.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { clearanceLevel } = bodyValidation.data as CreateClearanceEventRequest;

      const promotion = await PromotionService.addClearanceEvent(id, clearanceLevel);

      return Send.success(res, promotion, "Clearance event added to promotion successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to add clearance event");

      if (error.message === "Promotion not found") {
        return Send.notFound(res, null, "Promotion not found");
      }

      return Send.error(res, null, "Failed to add clearance event");
    }
  }

  /**
   * Get active promotions
   * GET /promotions/active
   */
  static async getActivePromotions(req: Request, res: Response) {
    try {
      const { skip = 0, take = 10 } = req.query;

      const result = await PromotionService.getActivePromotions(
        parseInt(skip as string) || 0,
        parseInt(take as string) || 10
      );

      return Send.success(res, result, "Active promotions fetched successfully");
    } catch (error) {
      logger.error({ error }, "Failed to fetch active promotions");
      return Send.error(res, null, "Failed to fetch active promotions");
    }
  }
}
