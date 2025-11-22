import CategoryController from "./categories.controller";
import BaseRouter, { RouteConfig } from "util/router";
import { adminGuard } from "middlewares/authGuard";

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories with optional filtering and pagination
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of categories to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of categories to return
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by category name or description
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *       500:
 *         description: Failed to fetch categories
 *
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Electronic products and gadgets
 *     responses:
 *       200:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request or category name already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User must be an admin
 *       500:
 *         description: Failed to create category
 *
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to fetch category
 *
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid request or category name already exists
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to update category
 *
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Cannot delete category with existing products
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to delete category
 *
 * /categories/name/{name}:
 *   get:
 *     summary: Get a category by name
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to fetch category
 *
 * /categories/all/simple:
 *   get:
 *     summary: Get all categories without pagination (for dropdowns/selects)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Failed to fetch categories
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 */

class CategoryRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/all/simple",
        middlewares: [],
        controller: CategoryController.getAllCategoriesSimple,
      },
      {
        method: "get",
        path: "/",
        middlewares: [],
        controller: CategoryController.getAllCategories,
      },
      {
        method: "get",
        path: "/name/:name",
        middlewares: [],
        controller: CategoryController.getCategoryByName,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [],
        controller: CategoryController.getCategoryById,
      },
      {
        method: "post",
        path: "/",
        middlewares: [adminGuard],
        controller: CategoryController.createCategory,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [adminGuard],
        controller: CategoryController.updateCategory,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [adminGuard],
        controller: CategoryController.deleteCategory,
      },
    ];
  }
}

export default new CategoryRouter().router;
