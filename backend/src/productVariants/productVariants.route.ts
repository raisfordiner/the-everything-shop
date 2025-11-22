import ProductVariantController from "./productVariants.controller";
import BaseRouter, { RouteConfig } from "util/router";
import { adminOrSellerGuard, sellerGuard } from "middlewares/authGuard";

/**
 * @swagger
 * /product-variants:
 *   get:
 *     summary: Get all product variants with optional filtering and pagination
 *     tags: [Product Variants]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of variants to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of variants to return
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *     responses:
 *       200:
 *         description: Product variants fetched successfully
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
 *                     productVariants:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *       500:
 *         description: Failed to fetch product variants
 *
 *   post:
 *     summary: Create a new product variant (Seller only)
 *     tags: [Product Variants]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - variantAttributes
 *             properties:
 *               productId:
 *                 type: string
 *                 example: product_id_123
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               variantAttributes:
 *                 type: object
 *                 example:
 *                   size: "M"
 *                   color: "Red"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               priceAdjustment:
 *                 type: number
 *                 example: 10.50
 *     responses:
 *       200:
 *         description: Product variant created successfully
 *       400:
 *         description: Invalid request or product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User must be a seller or not authorized
 *       500:
 *         description: Failed to create product variant
 *
 * /product-variants/{id}:
 *   get:
 *     summary: Get a single product variant by ID
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Product variant fetched successfully
 *       404:
 *         description: Product variant not found
 *       500:
 *         description: Failed to fetch product variant
 *
 *   put:
 *     summary: Update a product variant (Seller only)
 *     tags: [Product Variants]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               variantAttributes:
 *                 type: object
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               priceAdjustment:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product variant updated successfully
 *       403:
 *         description: Not authorized to update this product variant
 *       404:
 *         description: Product variant not found
 *       500:
 *         description: Failed to update product variant
 *
 *   delete:
 *     summary: Delete a product variant (Seller & Admin)
 *     tags: [Product Variants]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Product variant deleted successfully
 *       403:
 *         description: Not authorized to delete this product variant
 *       404:
 *         description: Product variant not found
 *       500:
 *         description: Failed to delete product variant
 *
 * /product-variants/product/{productId}:
 *   get:
 *     summary: Get product variants by product ID
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
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
 *         description: Product variants fetched successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to fetch product variants
 *
 * /product-variants/{id}/quantity:
 *   patch:
 *     summary: Update product variant quantity (Seller & Admin)
 *     tags: [Product Variants]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Product variant quantity updated successfully
 *       400:
 *         description: Invalid quantity value
 *       403:
 *         description: Not authorized to update this product variant
 *       404:
 *         description: Product variant not found
 *       500:
 *         description: Failed to update quantity
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 */

class ProductVariantRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [],
        controller: ProductVariantController.getAllProductVariants,
      },
      {
        method: "get",
        path: "/product/:productId",
        middlewares: [],
        controller: ProductVariantController.getProductVariantsByProductId,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [],
        controller: ProductVariantController.getProductVariantById,
      },
      {
        method: "post",
        path: "/",
        middlewares: [sellerGuard],
        controller: ProductVariantController.createProductVariant,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [adminOrSellerGuard],
        controller: ProductVariantController.updateProductVariant,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [adminOrSellerGuard],
        controller: ProductVariantController.deleteProductVariant,
      },
      {
        method: "patch",
        path: "/:id/quantity",
        middlewares: [adminOrSellerGuard],
        controller: ProductVariantController.updateQuantity,
      },
    ];
  }
}

export default new ProductVariantRouter().router;
