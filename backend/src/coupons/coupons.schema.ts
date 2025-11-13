import { z } from "zod";

const create = z.object({
  promotionId: z.string().min(1, "Promotion ID is required"),
  code: z.string().min(3, "Coupon code must be at least 3 characters").max(50, "Coupon code too long"),
  discountPercentage: z.number().min(0, "Discount must be at least 0").max(100, "Discount cannot exceed 100%"),
  maxUsage: z.number().int().min(1, "Max usage must be at least 1"),
});

const update = z.object({
  promotionId: z.string().min(1, "Promotion ID is required").optional(),
  code: z.string().min(3, "Coupon code must be at least 3 characters").max(50, "Coupon code too long").optional(),
  discountPercentage: z
    .number()
    .min(0, "Discount must be at least 0")
    .max(100, "Discount cannot exceed 100%")
    .optional(),
  maxUsage: z.number().int().min(1, "Max usage must be at least 1").optional(),
  usageCount: z.number().int().optional(),
});

const search = z.object({
  q: z.string().optional(),
  promotionId: z.string().optional(),
});

const CouponsSchema = { create, update, search };

export default CouponsSchema;
