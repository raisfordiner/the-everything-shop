import { z } from "zod";
import { PromotionStatus, ClearanceLevel } from "@prisma/client";

/**
 * Promotion name validation
 */
const promotionNameSchema = z
  .string()
  .min(3, "Promotion name must be at least 3 characters long")
  .max(100, "Promotion name must not exceed 100 characters")
  .trim();

/**
 * Promotion description validation
 */
const promotionDescriptionSchema = z
  .string()
  .min(5, "Promotion description must be at least 5 characters long")
  .max(500, "Promotion description must not exceed 500 characters")
  .trim()
  .optional();

/**
 * Start and end date validation
 */
const startDateSchema = z
  .string()
  .datetime("Start date must be a valid ISO datetime string")
  .or(z.date());

const endDateSchema = z
  .string()
  .datetime("End date must be a valid ISO datetime string")
  .or(z.date());

/**
 * Promotion status validation
 */
const statusSchema = z
  .nativeEnum(PromotionStatus)
  .optional()
  .default(PromotionStatus.ACTIVE);

/**
 * Product IDs array validation
 */
const productIdsSchema = z
  .array(z.string().min(1, "Product ID cannot be empty"))
  .optional()
  .default([]);

/**
 * Category IDs array validation
 */
const categoryIdsSchema = z
  .array(z.string().min(1, "Category ID cannot be empty"))
  .optional()
  .default([]);

/**
 * Coupon validation schema
 */
const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters long")
    .max(50, "Coupon code must not exceed 50 characters")
    .trim(),
  discountPercentage: z
    .number()
    .min(0, "Discount percentage must be 0 or greater")
    .max(100, "Discount percentage must not exceed 100"),
  maxUsage: z
    .number()
    .int("Max usage must be an integer")
    .min(1, "Max usage must be at least 1"),
});

/**
 * Clearance event validation schema
 */
const clearanceEventSchema = z.object({
  clearanceLevel: z.nativeEnum(ClearanceLevel),
});

/**
 * Create promotion schema
 */
const createPromotion = z
  .object({
    name: promotionNameSchema,
    description: promotionDescriptionSchema,
    startDate: startDateSchema,
    endDate: endDateSchema,
    status: statusSchema,
    appliedProducts: productIdsSchema,
    appliedCategories: categoryIdsSchema,
    coupons: z.array(couponSchema).optional(),
    clearanceEvents: z.array(clearanceEventSchema).optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

/**
 * Update promotion schema (all fields optional except at least one must be provided)
 */
const updatePromotion = z
  .object({
    name: promotionNameSchema.optional(),
    description: promotionDescriptionSchema,
    startDate: startDateSchema.optional(),
    endDate: endDateSchema.optional(),
    status: statusSchema,
    appliedProducts: productIdsSchema,
    appliedCategories: categoryIdsSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

/**
 * Pagination parameters schema
 */
const paginationParams = z.object({
  skip: z.coerce.number().int().min(0).optional().default(0),
  take: z.coerce.number().int().min(1).max(100).optional().default(10),
});

/**
 * Get all promotions query schema
 */
const getAllPromotionsQuery = paginationParams.extend({
  status: z.nativeEnum(PromotionStatus).optional(),
  search: z.string().max(255).optional(),
});

/**
 * Apply products to promotion schema
 */
const applyProductsSchema = z.object({
  productIds: z.array(z.string().min(1)).min(1, "At least one product ID is required"),
});

/**
 * Apply categories to promotion schema
 */
const applyCategoriesSchema = z.object({
  categoryIds: z.array(z.string().min(1)).min(1, "At least one category ID is required"),
});

/**
 * Create coupon schema
 */
const createCouponSchema = z.object({
  code: couponSchema.shape.code,
  discountPercentage: couponSchema.shape.discountPercentage,
  maxUsage: couponSchema.shape.maxUsage,
});

/**
 * Create clearance event schema
 */
const createClearanceEventSchema = z.object({
  clearanceLevel: clearanceEventSchema.shape.clearanceLevel,
});

export type CreatePromotionRequest = z.infer<typeof createPromotion>;
export type UpdatePromotionRequest = z.infer<typeof updatePromotion>;
export type GetAllPromotionsQuery = z.infer<typeof getAllPromotionsQuery>;
export type ApplyProductsRequest = z.infer<typeof applyProductsSchema>;
export type ApplyCategoriesRequest = z.infer<typeof applyCategoriesSchema>;
export type CreateCouponRequest = z.infer<typeof createCouponSchema>;
export type CreateClearanceEventRequest = z.infer<typeof createClearanceEventSchema>;

const PromotionSchema = {
  createPromotion,
  updatePromotion,
  getAllPromotionsQuery,
  applyProductsSchema,
  applyCategoriesSchema,
  createCouponSchema,
  createClearanceEventSchema,
  paginationParams,
};

export default PromotionSchema;
