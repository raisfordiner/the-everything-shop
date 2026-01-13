import { prisma } from "util/db";
import { CancellationStatus } from "@prisma/client";

const cancellationInclude = {
  order: true,
};

export default class CancellationService {
  static async find(id?: string, q?: string, orderId?: string, status?: CancellationStatus) {
    if (id) {
      return await prisma.cancellation.findUnique({
        where: { id },
        include: cancellationInclude,
      });
    }

    return await prisma.cancellation.findMany({
      where: {
        OR: q ? [{ reason: { contains: q, mode: "insensitive" } }] : undefined,
        orderId: orderId || undefined,
        status: status || undefined,
      },
      include: cancellationInclude,
    });
  }

  static async create(data: { orderId: string; reason: string }) {
    const existingCancellation = await prisma.cancellation.findUnique({ where: { orderId: data.orderId } });
    if (existingCancellation) {
      throw new Error("Cancellation already exists for this order");
    }

    const order = await prisma.order.findUnique({ where: { id: data.orderId } });
    if (!order) {
      throw new Error("Order not found");
    }

    return await prisma.cancellation.create({
      data: {
        orderId: data.orderId,
        reason: data.reason,
      },
      include: cancellationInclude,
    });
  }

  /**
   * Create cancellation request from customer
   * Validates order belongs to customer and has SHIPPED status
   */
  static async createCustomerRequest(data: { orderId: string; reason: string; customerId: string }) {
    // Note: customerId here is actually the userId from the auth token
    // We need to look up the Customer by userId
    const customer = await prisma.customer.findUnique({
      where: { userId: data.customerId }
    });

    if (!customer) {
      throw new Error("Customer profile not found");
    }

    // Check if cancellation already exists
    const existingCancellation = await prisma.cancellation.findUnique({ where: { orderId: data.orderId } });
    if (existingCancellation) {
      throw new Error("Cancellation request already exists for this order");
    }

    // Validate order exists and belongs to customer
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.customerId !== customer.id) {
      throw new Error("Order does not belong to this customer");
    }

    // Validate order status is SHIPPED
    if (order.status !== 'SHIPPED') {
      throw new Error("Cancellation requests can only be made for shipped orders. For pending orders, you can cancel directly.");
    }

    return await prisma.cancellation.create({
      data: {
        orderId: data.orderId,
        reason: data.reason,
        status: 'REQUESTED',
      },
      include: cancellationInclude,
    });
  }

  /**
   * Customer withdraws their cancellation request
   */
  static async withdrawCustomerRequest(orderId: string, userId: string) {
    // Look up Customer by userId
    const customer = await prisma.customer.findUnique({
      where: { userId }
    });

    if (!customer) {
      throw new Error("Customer profile not found");
    }

    // Find cancellation by orderId
    const cancellation = await prisma.cancellation.findUnique({
      where: { orderId },
      include: { order: true }
    });

    if (!cancellation) {
      throw new Error("Cancellation request not found");
    }

    // Verify order belongs to customer
    if (cancellation.order.customerId !== customer.id) {
      throw new Error("This request does not belong to you");
    }

    // Can only withdraw REQUESTED status
    if (cancellation.status !== 'REQUESTED') {
      throw new Error("Can only withdraw pending requests");
    }

    return await prisma.cancellation.delete({
      where: { id: cancellation.id }
    });
  }

  static async update(id: string, data: { reason?: string; status?: CancellationStatus }) {
    const cancellation = await prisma.cancellation.findUnique({
      where: { id },
      include: { order: { include: { payment: true } } }
    });
    if (!cancellation) {
      throw new Error("Cancellation not found");
    }

    // If status is changing to APPROVED, also cancel the order
    if (data.status === 'APPROVED' && cancellation.status !== 'APPROVED') {
      await prisma.order.update({
        where: { id: cancellation.orderId },
        data: { status: 'CANCELLED' }
      });

      // Log negative revenue for cancellation
      try {
        const amount = cancellation.order.payment?.amount || 0;
        await prisma.revenueLog.create({
          data: {
            type: 'CANCELLATION_COMPLETED',
            orderId: cancellation.orderId,
            amount: -amount, // Negative for cancellations
            details: { reason: cancellation.reason },
          },
        });
      } catch (e) {
        console.error('Failed to create revenue log for cancellation:', e);
      }
    }

    return await prisma.cancellation.update({
      where: { id },
      data,
      include: cancellationInclude,
    });
  }

  static async delete(id: string) {
    return await prisma.cancellation.delete({
      where: { id },
    });
  }
}
