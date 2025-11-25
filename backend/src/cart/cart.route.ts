import BaseRouter, { RouteConfig } from "util/router";
import AuthMiddleware from "auth/auth.middleware";
import CartController from "./cart.controller";
import { validateBody, validateQuery } from "util/validation";
import CartSchema from "./cart.schema";

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Shopping cart management endpoints
 *
 * /carts:
 *   get:
 *     summary: Get all carts or filter by customer ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerID
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter carts by customer ID
 *     responses:
 *       200:
 *         description: List of carts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       customerId:
 *                         type: string
 *                       cartItems:
 *                         type: array
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Carts not found
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create new cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *             properties:
 *               customerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /carts/{id}:
 *   get:
 *     summary: Get cart by ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     customerId:
 *                       type: string
 *                     cartItems:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /carts/{cartId}/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productVariantId
 *               - quantity
 *             properties:
 *               productVariantId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /carts/{cartId}/items/{itemId}:
 *   get:
 *     summary: Get cart item
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart Item ID
 *     responses:
 *       200:
 *         description: Cart item details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart Item ID
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
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart Item ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

class CartRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAuth = [AuthMiddleware.authenticateUser];

    return [
      {
        method: "get",
        path: "/",
        middlewares: [...checkIfAuth, validateQuery(CartSchema.search)],
        controller: CartController.getCarts,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [...checkIfAuth],
        controller: CartController.getCarts,
      },
      {
        method: "post",
        path: "/",
        middlewares: [...checkIfAuth, validateBody(CartSchema.create)],
        controller: CartController.createCart,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: checkIfAuth,
        controller: CartController.deleteCart,
      },
      {
        method: "post",
        path: "/:cartId/items",
        middlewares: [...checkIfAuth, validateBody(CartSchema.addItem)],
        controller: CartController.addCartItem,
      },
      {
        method: "get",
        path: "/:cartId/items/:itemId",
        middlewares: checkIfAuth,
        controller: CartController.getCartItem,
      },
      {
        method: "put",
        path: "/:cartId/items/:itemId",
        middlewares: [...checkIfAuth, validateBody(CartSchema.updateItem)],
        controller: CartController.updateCartItem,
      },
      {
        method: "delete",
        path: "/:cartId/items/:itemId",
        middlewares: checkIfAuth,
        controller: CartController.deleteCartItem,
      },
    ];
  }
}

export default new CartRoutes().router;
