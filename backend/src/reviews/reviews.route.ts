import BaseRouter, { RouteConfig } from "util/router";
import AuthMiddleware from "auth/auth.middleware";
import ReviewsController from "./reviews.controller";
import { validateBody, validateQuery } from "util/validation";
import ReviewsSchema from "./reviews.schema";
import { adminGuard, authGuard } from "middlewares/authGuard";

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management endpoints (Admin only)
 *
 * /reviews:
 *   get:
 *     summary: Get all reviews or search reviews (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query for comment (case-insensitive)
 *       - in: query
 *         name: customerId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: rating
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       rating:
 *                         type: integer
 *                       comment:
 *                         type: string
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                       reviewDate:
 *                         type: string
 *                         format: date-time
 *                       orderItemId:
 *                         type: string
 *                       customerId:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Reviews not found
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create new review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - orderItemId
 *               - customerId
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               orderItemId:
 *                 type: string
 *               customerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *
 * /reviews/{id}:
 *   get:
 *     summary: Get review by ID (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                     comment:
 *                       type: string
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     reviewDate:
 *                       type: string
 *                       format: date-time
 *                     orderItemId:
 *                       type: string
 *                     customerId:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */

class ReviewsRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAdmin = [authGuard, adminGuard];
    const checkIfUser = [authGuard];

    return [
      {
        method: "get",
        path: "/",
        middlewares: [...checkIfUser, validateQuery(ReviewsSchema.search)],
        controller: ReviewsController.getReviews,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [...checkIfAdmin],
        controller: ReviewsController.getReviews,
      },
      {
        method: "post",
        path: "/",
        middlewares: [...checkIfUser, validateBody(ReviewsSchema.create)],
        controller: ReviewsController.createReview,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [...checkIfAdmin, validateBody(ReviewsSchema.update)],
        controller: ReviewsController.updateReview,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: checkIfAdmin,
        controller: ReviewsController.deleteReview,
      },
    ];
  }
}

export default new ReviewsRoutes().router;
