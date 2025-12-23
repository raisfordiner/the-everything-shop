import BaseRouter, { RouteConfig } from "util/router";
import OrderController from "./order.controller";
import { validateBody } from "util/validation";
import OrderSchema from "./order.schema";
import { authGuard } from "middlewares/authGuard";

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 *
 * /orders:
 *   post:
 *     summary: Create order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer or cart not found
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by customer ID (admin only)
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

class OrdersRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [authGuard],
        controller: OrderController.get,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [authGuard],
        controller: OrderController.get,
      },
      {
        method: "post",
        path: "/",
        middlewares: [authGuard, validateBody(OrderSchema.create)],
        controller: OrderController.create,
      },
      {
        method: "post",
        path: "/direct",
        middlewares: [authGuard, validateBody(OrderSchema.createDirect)],
        controller: OrderController.createDirect,
      },
      {
        method: "patch",
        path: "/:id",
        middlewares: [authGuard, validateBody(OrderSchema.update)],
        controller: OrderController.updateStatus,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [authGuard],
        controller: OrderController.delete,
      },
    ];
  }
}

export default new OrdersRoutes().router;
