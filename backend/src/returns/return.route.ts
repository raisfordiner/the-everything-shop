import BaseRouter, { RouteConfig } from "util/router";
import ReturnController from "./return.controller";
import { validateBody, validateQuery } from "util/validation";
import ReturnSchema from "./return.schema";
import { adminOrSellerGuard, authGuard } from "middlewares/authGuard";

/**
 * @swagger
 * tags:
 *   name: Returns
 *   description: Return management endpoints (Admin/Seller only)
 *
 * /returns:
 *   get:
 *     summary: Get all returns or search returns (Admin/Seller only)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query for return reason (case-insensitive)
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
 *         description: Filter by return status
 *     responses:
 *       200:
 *         description: List of returns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 returns:
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
 *                       order:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Seller access required
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create new return (Admin/Seller only)
 *     tags: [Returns]
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
 *         description: Return created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Seller access required
 *       500:
 *         description: Internal server error
 *
 * /returns/{id}:
 *   get:
 *     summary: Get return by ID (Admin/Seller only)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Return ID
 *     responses:
 *       200:
 *         description: Return details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 return:
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
 *                     order:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Seller access required
 *       404:
 *         description: Return not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update return (Admin/Seller only)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Return ID
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
 *         description: Return updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Seller access required
 *       404:
 *         description: Return not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete return (Admin/Seller only)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Return ID
 *     responses:
 *       200:
 *         description: Return deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Seller access required
 *       404:
 *         description: Return not found
 *       500:
 *         description: Internal server error
 */

class ReturnRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAdminSeller = [authGuard, adminOrSellerGuard];

    return [
      {
        path: "/",
        method: "get",
        middlewares: [...checkIfAdminSeller, validateQuery(ReturnSchema.search)],
        controller: ReturnController.getReturns,
      },
      {
        path: "/:id",
        method: "get",
        middlewares: checkIfAdminSeller,
        controller: ReturnController.getReturns,
      },
      // Customer-facing route to submit return request
      {
        path: "/request",
        method: "post",
        middlewares: [authGuard, validateBody(ReturnSchema.create)],
        controller: ReturnController.createCustomerReturnRequest,
      },
      {
        path: "/request/:orderId",
        method: "delete",
        middlewares: [authGuard],
        controller: ReturnController.withdrawCustomerRequest,
      },
      {
        path: "/",
        method: "post",
        middlewares: [...checkIfAdminSeller, validateBody(ReturnSchema.create)],
        controller: ReturnController.createReturn,
      },
      {
        path: "/:id",
        method: "put",
        middlewares: [...checkIfAdminSeller, validateBody(ReturnSchema.update)],
        controller: ReturnController.updateReturn,
      },
      {
        path: "/:id",
        method: "delete",
        middlewares: checkIfAdminSeller,
        controller: ReturnController.deleteReturn,
      },
    ];
  }
}

export default new ReturnRouter().router;
