import ProductController from "./product.controller";
import BaseRouter, { RouteConfig } from "util/router";
import { adminOrSellerGuard, sellerGuard } from "middlewares/authGuard";

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with optional filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of products to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products to return
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name or description
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *       500:
 *         description: Failed to fetch products
 *
 *   post:
 *     summary: Create a new product (Seller only)
 *     tags: [Products]
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
 *               - description
 *               - price
 *               - stockQuantity
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amazing Product
 *               description:
 *                 type: string
 *                 example: Product description
 *               price:
 *                 type: number
 *                 example: 99.99
 *               stockQuantity:
 *                 type: integer
 *                 example: 100
 *               categoryId:
 *                 type: string
 *                 example: category_id_123
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               variantTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *               variantOptions:
 *                 type: object
 *     responses:
 *       200:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request or category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User must be a seller
 *       500:
 *         description: Failed to create product
 *
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to fetch product
 *
 *   put:
 *     summary: Update a product (Seller only)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
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
 *               price:
 *                 type: number
 *               stockQuantity:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               variantTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *               variantOptions:
 *                 type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         description: Not authorized to update this product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product
 *
 *   delete:
 *     summary: Delete a product (Seller & Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Not authorized to delete this product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to delete product
 *
 * /products/seller/{sellerId}:
 *   get:
 *     summary: Get products by seller
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       500:
 *         description: Failed to fetch seller products
 *
 * /products/category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       500:
 *         description: Failed to fetch category products
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 */

class ProductRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [],
        controller: ProductController.getAllProducts,
      },
      {
        method: "get",
        path: "/category/:categoryId",
        middlewares: [],
        controller: ProductController.getProductsByCategory,
      },
      {
        method: "get",
        path: "/seller/:sellerId",
        middlewares: [],
        controller: ProductController.getProductsBySeller,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [],
        controller: ProductController.getProductById,
      },
      {
        method: "post",
        path: "/",
        middlewares: [sellerGuard],
        controller: ProductController.createProduct,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [sellerGuard],
        controller: ProductController.updateProduct,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [adminOrSellerGuard],
        controller: ProductController.deleteProduct,
      },
    ];
  }
}

export default new ProductRouter().router;
