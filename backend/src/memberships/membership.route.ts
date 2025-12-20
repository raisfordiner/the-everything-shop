import BaseRouter, { RouteConfig } from "util/router";
import MembershipController from "./membership.controller";
import { validateBody, validateQuery } from "util/validation";
import MembershipSchema from "./membership.schema";
import { adminOrSellerGuard, authGuard } from "middlewares/authGuard";

/**
 * @swagger
 * tags:
 *   name: Memberships
 *   description: Customer membership tier management
 *
 * /memberships:
 *   get:
 *     summary: List all memberships with optional filters
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: membership
 *         schema:
 *           type: string
 *           enum: [BRONZE, SILVER, GOLD]
 *         description: Filter by tier
 *     responses:
 *       200:
 *         description: Memberships retrieved
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
 *         description: Forbidden
 *   post:
 *     summary: Create membership for customer
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
 *               - spent
 *             properties:
 *               customerId:
 *                 type: string
 *               spent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Membership created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /memberships/{id}:
 *   get:
 *     summary: Get membership by ID
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membership found
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
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update membership
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               spent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete membership
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
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
