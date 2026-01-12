import { Router } from "express";
import PaymentController from "./payment.controller";
import { adminOrSellerGuard } from "../middlewares/authGuard";

const paymentRoute = Router();

/**
 * @swagger
 * /payments/update-status/{orderId}:
 *   post:
 *     summary: Update payment status after Stripe redirect
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status updated
 *       400:
 *         description: Payment update failed
 */
paymentRoute.post("/update-status/:orderId", PaymentController.updatePaymentStatus);

/**
 * @swagger
 * /payments/{paymentId}/confirm-cod:
 *   post:
 *     summary: Confirm COD payment (Seller/Admin only)
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: COD payment confirmed successfully
 *       400:
 *         description: Invalid request or payment not found
 *       401:
 *         description: Unauthorized
 */
paymentRoute.post("/:paymentId/confirm-cod", adminOrSellerGuard, PaymentController.confirmCODPayment);

/**
 * @swagger
 * /payments/{paymentId}/status:
 *   put:
 *     summary: Manually update payment status (Seller/Admin only)
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [PENDING, SUCCESS, FAILED]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       400:
 *         description: Invalid request or payment not found
 *       401:
 *         description: Unauthorized
 */
paymentRoute.put("/:paymentId/status", adminOrSellerGuard, PaymentController.updatePaymentStatusManually);

export default paymentRoute;
