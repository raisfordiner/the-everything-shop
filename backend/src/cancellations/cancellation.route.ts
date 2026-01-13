import BaseRouter, { RouteConfig } from "util/router";
import CancellationController from "./cancellation.controller";
import { validateBody, validateQuery } from "util/validation";
import CancellationSchema from "./cancellation.schema";
import { adminOrSellerGuard, authGuard } from "middlewares/authGuard";

/**
 * @swagger
 * tags:
 *   name: Cancellations
 *   description: Order cancellation management endpoints (Admin only)
 *
 * /cancellations:
 *   get:
 *     summary: Get all cancellations or search cancellations (Admin only)
 *     tags: [Cancellations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query for reason (case-insensitive)
 *       - in: query
 *         name: orderId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by order ID
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [REQUESTED, APPROVED, REJECTED, COMPLETED]
 *         description: Filter by cancellation status
 *     responses:
 *       200:
 *         description: List of cancellations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cancellations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       orderId:
 *                         type: string
 *                       reason:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [REQUESTED, APPROVED, REJECTED, COMPLETED]
 *                       order:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create new cancellation (Admin only)
 *     tags: [Cancellations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - reason
 *             properties:
 *               orderId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cancellation created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *
 * /cancellations/{id}:
 *   get:
 *     summary: Get cancellation by ID (Admin only)
 *     tags: [Cancellations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cancellation ID
 *     responses:
 *       200:
 *         description: Cancellation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cancellation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     orderId:
 *                       type: string
 *                     reason:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [REQUESTED, APPROVED, REJECTED, COMPLETED]
 *                     order:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Cancellation not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update cancellation (Admin only)
 *     tags: [Cancellations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cancellation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [REQUESTED, APPROVED, REJECTED, COMPLETED]
 *     responses:
 *       200:
 *         description: Cancellation updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Cancellation not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete cancellation (Admin only)
 *     tags: [Cancellations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cancellation ID
 *     responses:
 *       200:
 *         description: Cancellation deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Cancellation not found
 *       500:
 *         description: Internal server error
 */

class CancellationRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAdminSeller = [authGuard, adminOrSellerGuard];

    return [
      {
        path: "/",
        method: "get",
        middlewares: [...checkIfAdminSeller, validateQuery(CancellationSchema.search)],
        controller: CancellationController.getCancellations,
      },
      {
        path: "/:id",
        method: "get",
        middlewares: checkIfAdminSeller,
        controller: CancellationController.getCancellations,
      },
      // Customer-facing route to submit cancellation request
      {
        path: "/request",
        method: "post",
        middlewares: [authGuard, validateBody(CancellationSchema.create)],
        controller: CancellationController.createCustomerCancellationRequest,
      },
      {
        path: "/request/:orderId",
        method: "delete",
        middlewares: [authGuard],
        controller: CancellationController.withdrawCustomerRequest,
      },
      {
        path: "/",
        method: "post",
        middlewares: [...checkIfAdminSeller, validateBody(CancellationSchema.create)],
        controller: CancellationController.createCancellation,
      },
      {
        path: "/:id",
        method: "put",
        middlewares: [...checkIfAdminSeller, validateBody(CancellationSchema.update)],
        controller: CancellationController.updateCancellation,
      },
      {
        path: "/:id",
        method: "delete",
        middlewares: checkIfAdminSeller,
        controller: CancellationController.deleteCancellation,
      },
    ];
  }
}

export default new CancellationRouter().router;
