import { Request, Response } from "express";
import PaymentService from "./payment.service";

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
}
