import { Router } from "express";
import ReportController from "./report.controller";
import { authGuard, adminGuard } from "middlewares/authGuard";

const router = Router();

/**
 * @swagger
 * /reports/inventory:
 *   get:
 *     summary: Get inventory logs
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PRODUCT_CREATED, OUT_OF_STOCK]
 *     responses:
 *       200:
 *         description: List of inventory logs
 */
router.get("/inventory", authGuard, adminGuard, ReportController.getInventoryLogs);

/**
 * @swagger
 * /reports/revenue:
 *   get:
 *     summary: Get revenue logs
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ORDER_COMPLETED, RETURN_COMPLETED, CANCELLATION_COMPLETED]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of revenue logs
 */
router.get("/revenue", authGuard, adminGuard, ReportController.getRevenueLogs);

/**
 * @swagger
 * /reports/audit:
 *   get:
 *     summary: Get audit logs
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [USER_SIGNUP, USER_LOGIN]
 *     responses:
 *       200:
 *         description: List of audit logs
 */
router.get("/audit", authGuard, adminGuard, ReportController.getAuditLogs);

export default router;
