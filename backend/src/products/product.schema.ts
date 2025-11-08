import { z } from "zod";
import { Variants } from "@prisma/client";

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
 * Stock quantity validation
 */
const stockQuantitySchema = z
  .number()
  .int("Stock quantity must be an integer")
  .min(0, "Stock quantity must be 0 or greater");

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
  .array(z.nativeEnum(Variants))
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
 * Create product schema
 */
const createProduct = z.object({
  name: productNameSchema,
  description: productDescriptionSchema,
  price: priceSchema,
  stockQuantity: stockQuantitySchema,
  categoryId: categoryIdSchema,
  images: imagesSchema,
  variantTypes: variantTypesSchema,
  variantOptions: variantOptionsSchema,
});

/**
 * Update product schema (all fields optional)
 */
const updateProduct = z
  .object({
    name: productNameSchema.optional(),
    description: productDescriptionSchema.optional(),
    price: priceSchema.optional(),
    stockQuantity: stockQuantitySchema.optional(),
    images: imagesSchema,
    variantTypes: variantTypesSchema,
    variantOptions: variantOptionsSchema,
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
});

export interface CreateProductRequest extends z.infer<typeof createProduct> {}
export interface UpdateProductRequest extends z.infer<typeof updateProduct> {}
export interface GetAllProductsQuery extends z.infer<typeof getAllProductsQuery> {}

const ProductSchema = {
  createProduct,
  updateProduct,
  getAllProductsQuery,
  paginationParams,
};

export default ProductSchema;
