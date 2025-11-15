import PromotionController from "./promotions.controller";
import BaseRouter, { RouteConfig } from "util/router";
import { adminGuard } from "middlewares/authGuard";

/**
 * @swagger
 * /promotions:
 *   get:
 *     summary: Get all promotions with optional filtering and pagination
 *     tags: [Promotions]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of promotions to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of promotions to return
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by promotion status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by promotion name or description
 *     responses:
 *       200:
 *         description: Promotions fetched successfully
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
 *       500:
 *         description: Failed to fetch promotions
 *
 *   post:
 *     summary: Create a new promotion (Admin only)
 *     tags: [Promotions]
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
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Summer Sale 2025
 *               description:
 *                 type: string
 *                 example: Amazing summer discount
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-31T23:59:59Z"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 default: ACTIVE
 *               appliedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *               appliedCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *               coupons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     discountPercentage:
 *                       type: number
 *                     maxUsage:
 *                       type: integer
 *               clearanceEvents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     clearanceLevel:
 *                       type: string
 *                       enum: [HIGH, MEDIUM, LOW]
 *     responses:
 *       200:
 *         description: Promotion created successfully
 *       400:
 *         description: Invalid request or related resources not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User must be an admin
 *       500:
 *         description: Failed to create promotion
 *
 * /promotions/{id}:
 *   get:
 *     summary: Get a single promotion by ID
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion fetched successfully
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Failed to fetch promotion
 *
 *   put:
 *     summary: Update a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
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
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Failed to update promotion
 *
 *   delete:
 *     summary: Delete a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion deleted successfully
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Failed to delete promotion
 *
 * /promotions/{id}/products:
 *   post:
 *     summary: Apply products to a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Products applied successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Promotion or products not found
 *       500:
 *         description: Failed to apply products
 *
 *   delete:
 *     summary: Remove products from a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Products removed successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Failed to remove products
 *
 * /promotions/{id}/categories:
 *   post:
 *     summary: Apply categories to a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Categories applied successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Promotion or categories not found
 *       500:
 *         description: Failed to apply categories
 *
 *   delete:
 *     summary: Remove categories from a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Categories removed successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Failed to remove categories
 *
 * /promotions/{id}/coupons:
 *   post:
 *     summary: Add coupon to a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountPercentage
 *               - maxUsage
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER2025
 *               discountPercentage:
 *                 type: number
 *                 example: 20
 *               maxUsage:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Coupon added successfully
 *       400:
 *         description: Invalid request or coupon code already exists
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Failed to add coupon
 *
 * /promotions/{id}/clearance-events:
 *   post:
 *     summary: Add clearance event to a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clearanceLevel
 *             properties:
 *               clearanceLevel:
 *                 type: string
 *                 enum: [HIGH, MEDIUM, LOW]
 *     responses:
 *       200:
 *         description: Clearance event added successfully
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Failed to add clearance event
 *
 * /promotions/active:
 *   get:
 *     summary: Get currently active promotions
 *     tags: [Promotions]
 *     parameters:
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
 *         description: Active promotions fetched successfully
 *       500:
 *         description: Failed to fetch active promotions
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 */

class PromotionRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/active",
        middlewares: [],
        controller: PromotionController.getActivePromotions,
      },
      {
        method: "get",
        path: "/",
        middlewares: [],
        controller: PromotionController.getAllPromotions,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [],
        controller: PromotionController.getPromotionById,
      },
      {
        method: "post",
        path: "/",
        middlewares: [adminGuard],
        controller: PromotionController.createPromotion,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [adminGuard],
        controller: PromotionController.updatePromotion,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [adminGuard],
        controller: PromotionController.deletePromotion,
      },
      {
        method: "post",
        path: "/:id/products",
        middlewares: [adminGuard],
        controller: PromotionController.applyProducts,
      },
      {
        method: "delete",
        path: "/:id/products",
        middlewares: [adminGuard],
        controller: PromotionController.removeProducts,
      },
      {
        method: "post",
        path: "/:id/categories",
        middlewares: [adminGuard],
        controller: PromotionController.applyCategories,
      },
      {
        method: "delete",
        path: "/:id/categories",
        middlewares: [adminGuard],
        controller: PromotionController.removeCategories,
      },
      {
        method: "post",
        path: "/:id/coupons",
        middlewares: [adminGuard],
        controller: PromotionController.addCoupon,
      },
      {
        method: "post",
        path: "/:id/clearance-events",
        middlewares: [adminGuard],
        controller: PromotionController.addClearanceEvent,
      },
    ];
  }
}

export default new PromotionRouter().router;
