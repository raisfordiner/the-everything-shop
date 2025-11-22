import { z } from "zod";

/**
 * Product ID validation
 */
const productIdSchema = z
  .string()
  .min(1, "Product ID is required")
  .trim();

/**
 * Quantity validation
 */
const quantitySchema = z
  .number()
  .int("Quantity must be an integer")
  .min(0, "Quantity must be 0 or greater");

/**
 * Variant attributes validation (key-value pairs)
 */
const variantAttributesSchema = z
  .record(z.string(), z.string())
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one variant attribute is required",
  });

/**
 * Images validation
 */
const imagesSchema = z
  .array(z.string().url("Each image must be a valid URL"))
  .min(0, "Images must be an array")
  .optional()
  .default([]);

/**
 * Price adjustment validation
 */
const priceAdjustmentSchema = z
  .number()
  .default(0)
  .optional();

/**
 * Create product variant schema
 */
const createProductVariant = z.object({
  productId: productIdSchema,
  quantity: quantitySchema,
  variantAttributes: variantAttributesSchema,
  images: imagesSchema,
  priceAdjustment: priceAdjustmentSchema,
});

/**
 * Update product variant schema (all fields optional except id)
 */
const updateProductVariant = z
  .object({
    quantity: quantitySchema.optional(),
    variantAttributes: variantAttributesSchema.optional(),
    images: imagesSchema,
    priceAdjustment: priceAdjustmentSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

/**
 * Pagination parameters schema
 */
const paginationParams = z.object({
  skip: z.coerce.number().int().min(0).optional().default(0),
  take: z.coerce.number().int().min(1).max(100).optional().default(10),
});

/**
 * Get all product variants query schema
 */
const getAllProductVariantsQuery = paginationParams.extend({
  productId: z.string().optional(),
  search: z.string().max(255).optional(),
});

export type CreateProductVariantRequest = z.infer<typeof createProductVariant>;
export type UpdateProductVariantRequest = z.infer<typeof updateProductVariant>;
export type GetAllProductVariantsQuery = z.infer<typeof getAllProductVariantsQuery>;

const ProductVariantSchema = {
  createProductVariant,
  updateProductVariant,
  getAllProductVariantsQuery,
  paginationParams,
};

export default ProductVariantSchema;
