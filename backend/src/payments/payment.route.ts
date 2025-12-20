import { Router } from "express";
import PaymentController from "./payment.controller";

const paymentRoute = Router();

/**
 * @swagger
 * /api/payments/update-status/{orderId}:
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

export default paymentRoute;
