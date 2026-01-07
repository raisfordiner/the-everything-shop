import { z } from "zod";

/**
 * Product name validation
 */
const productNameSchema = z
  .string()
  .min(3, "Product name must be at least 3 characters long")
  .max(255, "Product name must not exceed 255 characters")
  .trim();

/**
 * Product description validation
 */
const productDescriptionSchema = z
  .string()
  .min(10, "Product description must be at least 10 characters long")
  .max(2000, "Product description must not exceed 2000 characters")
  .trim();

/**
 * Product price validation
 */
const priceSchema = z
  .number()
  .positive("Price must be a positive number")
  .min(0.01, "Price must be at least 0.01")
  .max(999999999.99, "Price must not exceed 999999999.99");

/**
 * Category ID validation
 */
const categoryIdSchema = z
  .string()
  .min(1, "Category ID is required")
  .trim();

/**
 * Product images validation
 */
const imagesSchema = z
  .array(z.string().url("Each image must be a valid URL"))
  .min(0, "Images must be an array")
  .optional()
  .default([]);

/**
 * Variant types validation
 */
const variantTypesSchema = z
  .array(z.string())
  .optional()
  .default([]);

/**
 * Variant options validation (key-value pairs)
 */
const variantOptionsSchema = z
  .record(z.string(), z.array(z.string()))
  .optional()
  .default({});

/**
 * Single variant validation
 */
const variantSchema = z.object({
  variantAttributes: z.record(z.string(), z.any()).optional().default({}),
  quantity: z.number().int().min(0).default(0),
  priceAdjustment: z.number().default(0),
  images: z.array(z.string()).optional().default([]),
});

/**
 * Variants array validation
 */
const variantsSchema = z
  .array(variantSchema)
  .optional()
  .default([]);

/**
 * Create product schema
 */
const createProduct = z.object({
  name: productNameSchema,
  description: productDescriptionSchema,
  price: priceSchema,
  categoryId: categoryIdSchema,
  images: imagesSchema,
  variantTypes: variantTypesSchema,
  variantOptions: variantOptionsSchema,
  variants: variantsSchema,
});

/**
 * Update product schema (all fields optional)
 */
const updateProduct = z
  .object({
    name: productNameSchema.optional(),
    description: productDescriptionSchema.optional(),
    price: priceSchema.optional(),
    images: imagesSchema,
    variantTypes: variantTypesSchema,
    variantOptions: variantOptionsSchema,
    variants: variantsSchema,
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
 * Get all products query schema
 */
const getAllProductsQuery = paginationParams.extend({
  categoryId: z.string().optional(),
  search: z.string().max(255).optional(),
  sortBy: z.enum(["name", "price", "rating"]).optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
});

export type CreateProductRequest = z.infer<typeof createProduct>;
export type UpdateProductRequest = z.infer<typeof updateProduct>;
export type GetAllProductsQuery = z.infer<typeof getAllProductsQuery>;

const ProductSchema = {
  createProduct,
  updateProduct,
  getAllProductsQuery,
  paginationParams,
};

export default ProductSchema;
