import BaseRouter, { RouteConfig } from "util/router";
import AuthMiddleware from "auth/auth.middleware";
import EventsController from "./events.controller";
import { validateBody, validateQuery } from "util/validation";
import EventsSchema from "./events.schema";
import { adminOrSellerGuard, authGuard } from "middlewares/authGuard";

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Clearance event management endpoints (Admin only)
 *
 * /events:
 *   get:
 *     summary: Get all events or search events (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: promotionId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by promotion ID
 *       - in: query
 *         name: clearanceLevel
 *         required: false
 *         schema:
 *           type: string
 *           enum: [HIGH, MEDIUM, LOW]
 *         description: Filter by clearance level
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       promotionId:
 *                         type: string
 *                       clearanceLevel:
 *                         type: string
 *                         enum: [HIGH, MEDIUM, LOW]
 *                       promotion:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Events not found
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create new event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotionId
 *               - clearanceLevel
 *             properties:
 *               promotionId:
 *                 type: string
 *               clearanceLevel:
 *                 type: string
 *                 enum: [HIGH, MEDIUM, LOW]
 *     responses:
 *       200:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Internal server error
 *
 * /events/{id}:
 *   get:
 *     summary: Get event by ID (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     promotionId:
 *                       type: string
 *                     clearanceLevel:
 *                       type: string
 *                       enum: [HIGH, MEDIUM, LOW]
 *                     promotion:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clearanceLevel:
 *                 type: string
 *                 enum: [HIGH, MEDIUM, LOW]
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */

class EventsRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    const checkIfAdminSeller = [authGuard, adminOrSellerGuard];

    return [
      {
        method: "get",
        path: "/",
        middlewares: [...checkIfAdminSeller, validateQuery(EventsSchema.search)],
        controller: EventsController.getEvents,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [...checkIfAdminSeller],
        controller: EventsController.getEvents,
      },
      {
        method: "post",
        path: "/",
        middlewares: [...checkIfAdminSeller, validateBody(EventsSchema.create)],
        controller: EventsController.createEvent,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [...checkIfAdminSeller, validateBody(EventsSchema.update)],
        controller: EventsController.updateEvent,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: checkIfAdminSeller,
        controller: EventsController.deleteEvent,
      },
    ];
  }
}

export default new EventsRoutes().router;
