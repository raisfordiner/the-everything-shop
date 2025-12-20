import BaseRouter, { RouteConfig } from "util/router";
import MembershipController from "./membership.controller";
import { validateBody, validateQuery } from "util/validation";
import MembershipSchema from "./membership.schema";
import { adminOrSellerGuard, authGuard } from "middlewares/authGuard";

/**
 * @swagger
 * tags:
 *   name: Memberships
 *   description: Membership management endpoints (Admin only)
 *
 * /memberships:
 *   get:
 *     summary: Get all memberships or search memberships (Admin only)
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: customerId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: membership
 *         required: false
 *         schema:
 *           type: string
 *           enum: [BRONZE, SILVER, GOLD]
 *         description: Filter by membership status
 *     responses:
 *       200:
 *         description: List of memberships
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 memberships:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       customerId:
 *                         type: string
 *                       membership:
 *                         type: string
 *                         enum: [BRONZE, SILVER, GOLD]
 *                       spent:
 *                         type: number
 *                       customer:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create new membership (Admin only)
 *     tags: [Memberships]
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
 *               - membership
 *               - spent
 *             properties:
 *               customerId:
 *                 type: string
 *               membership:
 *                 type: string
 *                 enum: [BRONZE, SILVER, GOLD]
 *               spent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Membership created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *
 * /memberships/{id}:
 *   get:
 *     summary: Get membership by ID (Admin only)
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Membership ID
 *     responses:
 *       200:
 *         description: Membership details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 membership:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     customerId:
 *                       type: string
 *                     membership:
 *                       type: string
 *                       enum: [BRONZE, SILVER, GOLD]
 *                     spent:
 *                       type: number
 *                     customer:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update membership (Admin only)
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Membership ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               membership:
 *                 type: string
 *                 enum: [BRONZE, SILVER, GOLD]
 *               spent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Membership updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete membership (Admin only)
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Membership ID
 *     responses:
 *       200:
 *         description: Membership deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */

class MembershipRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAdminSeller = [authGuard, adminOrSellerGuard];

    return [
      {
        path: "/",
        method: "get",
        middlewares: [...checkIfAdminSeller, validateQuery(MembershipSchema.search)],
        controller: MembershipController.getMemberships,
      },
      {
        path: "/:id",
        method: "get",
        middlewares: checkIfAdminSeller,
        controller: MembershipController.getMemberships,
      },
      {
        path: "/",
        method: "post",
        middlewares: [...checkIfAdminSeller, validateBody(MembershipSchema.create)],
        controller: MembershipController.createMembership,
      },
      {
        path: "/:id",
        method: "put",
        middlewares: [...checkIfAdminSeller, validateBody(MembershipSchema.update)],
        controller: MembershipController.updateMembership,
      },
      {
        path: "/:id",
        method: "delete",
        middlewares: checkIfAdminSeller,
        controller: MembershipController.deleteMembership,
      },
    ];
  }
}

export default new MembershipRouter().router;
