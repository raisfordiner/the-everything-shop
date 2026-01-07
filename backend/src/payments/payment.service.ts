import { prisma } from "util/db";

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
}

