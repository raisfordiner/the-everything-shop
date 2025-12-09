import BaseRouter, { RouteConfig } from "util/router";
import AddressController from "./address.controller";
import { validateBody, validateQuery } from "util/validation";
import AddressSchema from "./address.schema";
import AuthMiddleware from "auth/auth.middleware";

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Address management endpoints
 *
 * /addresses:
 *   get:
 *     summary: Get all addresses or search addresses
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: province
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by province
 *       - in: query
 *         name: district
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by district
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 addresses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       customerId:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                       address:
 *                         type: string
 *                       street:
 *                         type: string
 *                       ward:
 *                         type: string
 *                       district:
 *                         type: string
 *                       province:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - address
 *             properties:
 *               customerId:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               street:
 *                 type: string
 *               ward:
 *                 type: string
 *               district:
 *                 type: string
 *               province:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Customer not found
 *       401:
 *         description: Unauthorized
 *
 * /addresses/{id}:
 *   get:
 *     summary: Get a single address by ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address details
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 *
 *   put:
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               street:
 *                 type: string
 *               ward:
 *                 type: string
 *               district:
 *                 type: string
 *               province:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *
 */

class AddressRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAuth = [AuthMiddleware.authenticateUser];

    return [
      {
        method: "get",
        path: "/",
        middlewares: [...checkIfAuth, validateQuery(AddressSchema.search)],
        controller: AddressController.getAddresses,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [...checkIfAuth],
        controller: AddressController.getAddresses,
      },
      {
        method: "post",
        path: "/",
        middlewares: [...checkIfAuth, validateBody(AddressSchema.create)],
        controller: AddressController.createAddress,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [...checkIfAuth, validateBody(AddressSchema.update)],
        controller: AddressController.updateAddress,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: checkIfAuth,
        controller: AddressController.deleteAddress,
      },
    ];
  }
}

export default new AddressRoutes().router;
