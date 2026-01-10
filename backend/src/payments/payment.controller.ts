import { Request, Response } from "express";
import PaymentService from "./payment.service";
import { updatePaymentStatusSchema, paymentIdParamSchema } from "./payment.schema";

export default class PaymentController {
  static async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const result = await PaymentService.updatePaymentStatus(orderId);
      res.json(result);
    } catch (err: any) {
      console.error('Payment update error:', err.message);
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Confirm COD payment (Seller/Admin only)
   */
  static async confirmCODPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;

      const result = await PaymentService.confirmCODPayment(paymentId);
      res.json(result);
    } catch (err: any) {
      console.error('COD confirmation error:', err.message);
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Manually update payment status (Seller/Admin only)
   */
  static async updatePaymentStatusManually(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;

      // Validate request body
      const validation = updatePaymentStatusSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid request body',
          details: validation.error.issues
        });
      }

      const { status } = validation.data;
      const result = await PaymentService.updatePaymentStatusManually(paymentId, status as any);
      res.json(result);
    } catch (err: any) {
      console.error('Payment status update error:', err.message);
      res.status(400).json({ error: err.message });
    }
  }
}
