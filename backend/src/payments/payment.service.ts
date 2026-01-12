import { prisma } from "util/db";
import { PaymentStatus } from "@prisma/client";

export default class PaymentService {
  static async updatePaymentStatus(orderId: string) {
    try {
      // Get the payment record
      const payment = await prisma.payment.findFirst({
        where: { orderId: orderId },
      });

      if (!payment) {
        throw new Error('Payment not found for this order');
      }

      // If payment method is not STRIPE, we don't need to check with Stripe
      if (payment.method !== 'STRIPE') {
        return {
          success: false,
          orderId,
          status: payment.status,
          message: 'Payment method is not Stripe',
        };
      }

      // Get the order with order items
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          payment: true,
          orderItems: true,
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Check if payment is already completed
      if (payment.status === 'SUCCESS') {
        return {
          success: true,
          orderId,
          status: 'COMPLETED',
          message: 'Payment already completed',
        };
      }

      // For Stripe sandbox, we trust the return from Stripe checkout
      // In production, you'd verify with Stripe API here
      const isSuccess = true;

      if (isSuccess) {
        // Use transaction to update payment and decrement stock atomically
        await prisma.$transaction(async (tx) => {
          // Update payment status to SUCCESS
          await tx.payment.updateMany({
            where: { orderId: orderId },
            data: { status: 'SUCCESS' },
          });

          // Decrement stock for each order item
          for (const orderItem of order.orderItems) {
            await tx.productVariant.update({
              where: { id: orderItem.productVariantId },
              data: {
                quantity: { decrement: orderItem.quantity },
              },
            });
          }
        });

        return {
          success: true,
          orderId,
          status: 'COMPLETED',
          message: 'Payment completed successfully',
        };
      } else {
        // Payment is not successful yet, keep as PENDING
        return {
          success: false,
          orderId,
          status: 'PENDING',
          message: 'Payment is pending or was cancelled',
        };
      }
    } catch (error: any) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  /**
   * Confirm COD payment (for sellers/admins when payment is received)
   */
  static async confirmCODPayment(paymentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.method !== 'COD') {
        throw new Error('This endpoint is only for COD payments');
      }

      if (payment.status === 'SUCCESS') {
        return {
          success: true,
          message: 'Payment already confirmed',
          payment,
        };
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'SUCCESS' },
      });

      return {
        success: true,
        message: 'COD payment confirmed successfully',
        payment: updatedPayment,
      };
    } catch (error: any) {
      throw new Error(`Failed to confirm COD payment: ${error.message}`);
    }
  }

  /**
   * Manually update payment status (for sellers/admins)
   */
  static async updatePaymentStatusManually(
    paymentId: string,
    newStatus: PaymentStatus
  ) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: newStatus },
      });

      return {
        success: true,
        message: `Payment status updated to ${newStatus}`,
        payment: updatedPayment,
      };
    } catch (error: any) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }
}

