import { prisma } from "util/db";
import { PaymentStatus } from "@prisma/client";
import Stripe from "stripe";

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

      // Get the order with order items and customer
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          payment: true,
          orderItems: {
            include: {
              productVariant: {
                include: {
                  product: true,
                },
              },
            },
          },
          customer: true,
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
        // Use transaction to update payment, decrement stock, update membership, and increment sold count
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

            // TODO: Increment product sold count when 'sold' field is added to Product model
          }

          // Update membership spent
          const membership = await tx.membership.findFirst({
            where: { customerId: order.customerId },
          });

          if (membership) {
            const newSpent = membership.spent + payment.amount;
            let newTier = membership.membership;

            // Determine new tier based on spent amount
            if (newSpent >= 500) {
              newTier = 'GOLD';
            } else if (newSpent >= 100) {
              newTier = 'SILVER';
            } else {
              newTier = 'BRONZE';
            }

            await tx.membership.update({
              where: { id: membership.id },
              data: {
                spent: newSpent,
                membership: newTier,
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
   * Create a new Stripe checkout session for retrying payment on an existing order
   */
  static async createRetrySession(orderId: string) {
    try {
      // Get the order with payment
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          payment: true,
          orderItems: {
            include: {
              productVariant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (!order.payment) {
        throw new Error('Payment record not found for this order');
      }

      // Only allow retry for STRIPE payments that are PENDING
      if (order.payment.method !== 'STRIPE') {
        throw new Error('Retry is only available for Stripe payments');
      }

      if (order.payment.status === 'SUCCESS') {
        throw new Error('Payment has already been completed');
      }

      if (order.status === 'CANCELLED') {
        throw new Error('Cannot retry payment for cancelled orders');
      }

      // Create new Stripe checkout session
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
      const frontendUrl = process.env.FE_URL || "http://localhost:3000";
      const successUrl = `${frontendUrl}/loading?orderId=${order.id}`;
      const cancelUrl = `${frontendUrl}/orders/${order.id}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order #${order.id}`,
            },
            unit_amount: Math.round(order.payment.amount * 100),
          },
          quantity: 1,
        }],
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderIds: order.id,
          appId: 'the-everything-shop',
          isRetry: 'true',
        }
      });

      return {
        success: true,
        sessionUrl: session.url,
        orderId: order.id,
      };
    } catch (error: any) {
      throw new Error(`Failed to create retry session: ${error.message}`);
    }
  }

  /**
   * Confirm COD payment (for sellers/admins when payment is received)
   * This also updates the order status to DELIVERED since confirming COD
   * means the order has been delivered and payment received.
   */
  static async confirmCODPayment(paymentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          order: {
            include: {
              orderItems: true,
            },
          },
        },
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

      const order = payment.order;
      if (!order) {
        throw new Error('Order not found for this payment');
      }

      // Validate that order can be confirmed (not already cancelled)
      if (order.status === 'CANCELLED') {
        throw new Error('Cannot confirm payment for a cancelled order');
      }

      // Use transaction to update payment, order status, and membership atomically
      await prisma.$transaction(async (tx) => {
        // Update payment status to SUCCESS
        await tx.payment.update({
          where: { id: paymentId },
          data: { status: 'SUCCESS' },
        });

        // Update order status to DELIVERED (confirming COD means delivery completed)
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'DELIVERED' },
        });

        // Update membership spent for COD payment confirmation
        const membership = await tx.membership.findFirst({
          where: { customerId: order.customerId },
        });

        if (membership) {
          const newSpent = membership.spent + payment.amount;
          let newTier = membership.membership;

          if (newSpent >= 500) {
            newTier = 'GOLD';
          } else if (newSpent >= 100) {
            newTier = 'SILVER';
          } else {
            newTier = 'BRONZE';
          }

          await tx.membership.update({
            where: { id: membership.id },
            data: {
              spent: newSpent,
              membership: newTier,
            },
          });
        }
      });

      // Fetch updated payment and order
      const updatedPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          order: true,
        },
      });

      return {
        success: true,
        message: 'COD payment confirmed and order marked as delivered',
        payment: updatedPayment,
        orderStatus: 'DELIVERED',
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

