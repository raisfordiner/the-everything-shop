import BaseRouter, { RouteConfig } from "util/router";
import AuthMiddleware from "auth/auth.middleware";
import UsersController from "./users.controller";
import { validateBody, validateQuery } from "util/validation";
import UsersSchema from "./users.schema";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints (Admin only)
 *
 * /users/{id}:
 *   get:
 *     summary: Get user by ID, search users, or get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *         description: User ID - if provided returns single user, if omitted returns all/filtered users
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query for username or email (case-insensitive)
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ADMIN, SELLER, CUSTOMER]
 *         description: Filter by user role
 *     responses:
 *       200:
 *         description: User details or list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Single user (when id provided)
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [ADMIN, SELLER, CUSTOMER]
 *                 users:
 *                   type: array
 *                   description: List of users (when id not provided)
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [ADMIN, SELLER, CUSTOMER]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found or Users not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [ADMIN, SELLER, CUSTOMER]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *
 * /users:
 *   post:
 *     summary: Create new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [ADMIN, SELLER, CUSTOMER]
 *     responses:
 *       200:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */

class UsersRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAdmin = [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin];

    return [
      {
        method: "get",
        path: "/:id",
        middlewares: [...checkIfAdmin, validateQuery(UsersSchema.search)],
        controller: UsersController.getUsers, // tested
      },
      {
        method: "post",
        path: "/",
        middlewares: [...checkIfAdmin, validateBody(UsersSchema.create)],
        controller: UsersController.createUser, // tested
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [...checkIfAdmin, validateBody(UsersSchema.update)],
        controller: UsersController.updateUser, // tested
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: checkIfAdmin,
        controller: UsersController.deleteUser, // tested
      },
    ];
  }
}

export default new UsersRoutes().router;
