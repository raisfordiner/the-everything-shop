import { Request, Response } from "express";
import Send from "util/response";
import CategoryService from "./categories.service";
import CategorySchema, {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  GetAllCategoriesQuery,
} from "./categories.schema";
import { logger } from "util/logger";

export default class CategoryController {
  /**
   * Get all categories with optional filtering and pagination
   * GET /categories?skip=0&take=10&search=xxx
   */
  static async getAllCategories(req: Request, res: Response) {
    try {
      const queryValidation = CategorySchema.getAllCategoriesQuery.safeParse(
        req.query
      );

      if (!queryValidation.success) {
        const errors = queryValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { skip, take, search } = queryValidation.data as GetAllCategoriesQuery;

      const result = await CategoryService.getAllCategories(skip, take, search);

      return Send.success(res, result, "Categories fetched successfully");
    } catch (error) {
      logger.error({ error }, "Failed to fetch categories");
      return Send.error(res, null, "Failed to fetch categories");
    }
  }

  /**
   * Get a single category by ID
   * GET /categories/:id
   */
  static async getCategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await CategoryService.getCategoryById(id);

      return Send.success(res, category, "Category fetched successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to fetch category");

      if (error.message === "Category not found") {
        return Send.notFound(res, null, "Category not found");
      }

      return Send.error(res, null, "Failed to fetch category");
    }
  }

  /**
   * Create a new category (Admin only)
   * POST /categories
   */
  static async createCategory(req: Request, res: Response) {
    try {
      const bodyValidation = CategorySchema.createCategory.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { name, description } = bodyValidation.data as CreateCategoryRequest;

      const category = await CategoryService.createCategory(name, description);

      return Send.success(res, category, "Category created successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to create category");

      if (error.message.includes("already exists")) {
        return Send.badRequest(res, null, error.message);
      }

      return Send.error(res, null, "Failed to create category");
    }
  }

  /**
   * Update a category (Admin only)
   * PUT /categories/:id
   */
  static async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = CategorySchema.updateCategory.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const updateData = bodyValidation.data as UpdateCategoryRequest;

      const category = await CategoryService.updateCategory(id, updateData);

      return Send.success(res, category, "Category updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to update category");

      if (error.message === "Category not found") {
        return Send.notFound(res, null, "Category not found");
      }

      if (error.message.includes("already exists")) {
        return Send.badRequest(res, null, error.message);
      }

      return Send.error(res, null, "Failed to update category");
    }
  }

  /**
   * Delete a category (Admin only)
   * DELETE /categories/:id
   */
  static async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await CategoryService.deleteCategory(id);

      return Send.success(res, result, "Category deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to delete category");

      if (error.message === "Category not found") {
        return Send.notFound(res, null, "Category not found");
      }

      if (error.message.includes("Cannot delete category")) {
        return Send.badRequest(res, null, error.message);
      }

      return Send.error(res, null, "Failed to delete category");
    }
  }

  /**
   * Get category by name
   * GET /categories/name/:name
   */
  static async getCategoryByName(req: Request, res: Response) {
    try {
      const { name } = req.params;

      const category = await CategoryService.getCategoryByName(
        decodeURIComponent(name)
      );

      if (!category) {
        return Send.notFound(res, null, "Category not found");
      }

      return Send.success(res, category, "Category fetched successfully");
    } catch (error) {
      logger.error({ error }, "Failed to fetch category by name");
      return Send.error(res, null, "Failed to fetch category");
    }
  }

  /**
   * Get all categories without pagination (for dropdowns/selects)
   * GET /categories/all/simple
   */
  static async getAllCategoriesSimple(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategoriesSimple();

      return Send.success(
        res,
        categories,
        "Categories fetched successfully"
      );
    } catch (error) {
      logger.error({ error }, "Failed to fetch categories");
      return Send.error(res, null, "Failed to fetch categories");
    }
  }
}
