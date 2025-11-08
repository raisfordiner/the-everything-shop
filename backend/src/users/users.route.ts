import BaseRouter, { RouteConfig } from "util/router";
import AuthMiddleware from "auth/auth.middleware";
import UsersController from "./users.controller";
import validateBody from "util/validation";
import AuthSchema from "auth/auth.schema";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints (Admin only)
 */

class UsersRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      /**
       * @swagger
       * /api/users:
       *   get:
       *     summary: Get all users (Admin only)
       *     tags: [Users]
       *     security:
       *       - bearerAuth: []
       *     responses:
       *       200:
       *         description: List of all users
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 users:
       *                   type: array
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
       *                       createdAt:
       *                         type: string
       *                         format: date-time
       *                       updatedAt:
       *                         type: string
       *                         format: date-time
       *       401:
       *         description: Unauthorized
       *       403:
       *         description: Forbidden - Admin access required
       *       404:
       *         description: Users not found
       *       500:
       *         description: Internal server error
       */
      {
        method: "get",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin],
        controller: UsersController.getUsers,
      },
      /**
       * @swagger
       * /api/users/search:
       *   get:
       *     summary: Search users by query and role (Admin only)
       *     tags: [Users]
       *     security:
       *       - bearerAuth: []
       *     parameters:
       *       - in: query
       *         name: q
       *         schema:
       *           type: string
       *         description: Search query for username or email
       *       - in: query
       *         name: role
       *         schema:
       *           type: string
       *           enum: [ADMIN, SELLER, CUSTOMER]
       *         description: Filter by user role
       *     responses:
       *       200:
       *         description: Search results
       *       401:
       *         description: Unauthorized
       *       403:
       *         description: Forbidden - Admin access required
       *       404:
       *         description: No users found
       *       500:
       *         description: Internal server error
       */
      {
        method: "get",
        path: "/search",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin],
        controller: UsersController.searchUsers,
      },
      /**
       * @swagger
       * /api/users/{id}:
       *   get:
       *     summary: Get user by ID (Admin only)
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
       *         description: User details
       *       401:
       *         description: Unauthorized
       *       403:
       *         description: Forbidden - Admin access required
       *       404:
       *         description: User not found
       *       500:
       *         description: Internal server error
       */
      {
        method: "get",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin],
        controller: UsersController.getUserById,
      },
      /**
       * @swagger
       * /api/users:
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
       *             properties:
       *               username:
       *                 type: string
       *               email:
       *                 type: string
       *                 format: email
       *               password:
       *                 type: string
       *                 format: password
       *               role:
       *                 type: string
       *                 enum: [ADMIN, SELLER, CUSTOMER]
       *                 default: CUSTOMER
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
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin, validateBody(AuthSchema.register)],
        controller: UsersController.createUser,
      },
      /**
       * @swagger
       * /api/users/{id}:
       *   put:
       *     summary: Update user - password cannot be updated (Admin only)
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
       *               email:
       *                 type: string
       *                 format: email
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
       */
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin, validateBody(AuthSchema.register)],
        controller: UsersController.updateUser,
      },
      /**
       * @swagger
       * /api/users/{id}:
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
       */
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin],
        controller: UsersController.deleteUser,
      },
    ];
  }
}

export default new UsersRoutes().router;
