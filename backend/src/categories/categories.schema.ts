import { z } from "zod";

/**
 * Category name validation
 */
const categoryNameSchema = z
  .string()
  .min(2, "Category name must be at least 2 characters long")
  .max(100, "Category name must not exceed 100 characters")
  .trim();

/**
 * Category description validation
 */
const categoryDescriptionSchema = z
  .string()
  .min(5, "Category description must be at least 5 characters long")
  .max(500, "Category description must not exceed 500 characters")
  .trim()
  .optional();

/**
 * Category ID validation
 */
const categoryIdSchema = z
  .string()
  .min(1, "Category ID is required")
  .trim();

/**
 * Create category schema
 */
const createCategory = z.object({
  name: categoryNameSchema,
  description: categoryDescriptionSchema,
});

/**
 * Update category schema (all fields optional)
 */
const updateCategory = z
  .object({
    name: categoryNameSchema.optional(),
    description: categoryDescriptionSchema,
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
 * Get all categories query schema
 */
const getAllCategoriesQuery = paginationParams.extend({
  search: z.string().max(255).optional(),
});

export type CreateCategoryRequest = z.infer<typeof createCategory>;
export type UpdateCategoryRequest = z.infer<typeof updateCategory>;
export type GetAllCategoriesQuery = z.infer<typeof getAllCategoriesQuery>;

const CategorySchema = {
  createCategory,
  updateCategory,
  getAllCategoriesQuery,
  paginationParams,
};

export default CategorySchema;
