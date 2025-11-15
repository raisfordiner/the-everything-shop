import BaseRouter, { RouteConfig } from "util/router";
import CouponsController from "./coupons.controller";
import { validateBody, validateQuery } from "util/validation";
import CouponsSchema from "./coupons.schema";
import { adminOrSellerGuard, authGuard } from "middlewares/authGuard";
import { check } from "zod";

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management endpoints (Admin only)
 *
 * /coupons:
 *   get:
 *     summary: Get all coupons or search coupons (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query for coupon code (case-insensitive)
 *       - in: query
 *         name: promotionId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by promotion ID
 *     responses:
 *       200:
 *         description: List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coupons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       promotionId:
 *                         type: string
 *                       code:
 *                         type: string
 *                       discountPercentage:
 *                         type: number
 *                       maxUsage:
 *                         type: integer
 *                       usageCount:
 *                         type: integer
 *                       promotion:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create new coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotionId
 *               - code
 *               - discountPercentage
 *               - maxUsage
 *             properties:
 *               promotionId:
 *                 type: string
 *               code:
 *                 type: string
 *               discountPercentage:
 *                 type: number
 *               maxUsage:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Coupon created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by ID (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coupon:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     promotionId:
 *                       type: string
 *                     code:
 *                       type: string
 *                     discountPercentage:
 *                       type: number
 *                     maxUsage:
 *                       type: integer
 *                     usageCount:
 *                       type: integer
 *                     promotion:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promotionId:
 *                 type: string
 *               code:
 *                 type: string
 *               discountPercentage:
 *                 type: number
 *               maxUsage:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Internal server error
 */

class CouponsRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAdminSeller = [authGuard, adminOrSellerGuard];

    return [
      {
        path: "/",
        method: "get",
        middlewares: [...checkIfAdminSeller, validateQuery(CouponsSchema.search)],
        controller: CouponsController.getCoupons,
      },
      {
        path: "/:id",
        method: "get",
        middlewares: checkIfAdminSeller,
        controller: CouponsController.getCoupons,
      },
      {
        path: "/",
        method: "post",
        middlewares: [...checkIfAdminSeller, validateBody(CouponsSchema.create)],
        controller: CouponsController.createCoupon,
      },
      {
        path: "/:id",
        method: "put",
        middlewares: [...checkIfAdminSeller, validateBody(CouponsSchema.update)],
        controller: CouponsController.updateCoupon,
      },
      {
        path: "/:id",
        method: "delete",
        middlewares: checkIfAdminSeller,
        controller: CouponsController.deleteCoupon,
      },
    ];
  }
}

export default new CouponsRouter().router;
