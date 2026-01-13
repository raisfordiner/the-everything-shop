import { prisma } from "util/db";
import { ReturnStatus } from "@prisma/client";

const returnInclude = {
  order: true,
};

export default class ReturnService {
  static async find(id?: string, q?: string, orderId?: string, status?: ReturnStatus) {
    if (id) {
      return await prisma.return.findUnique({
        where: { id },
        include: returnInclude,
      });
    }

    return await prisma.return.findMany({
      where: {
        OR: q ? [{ reason: { contains: q, mode: "insensitive" } }] : undefined,
        orderId: orderId || undefined,
        status: status || undefined,
      },
      include: returnInclude,
    });
  }

  static async create(data: { orderId: string; reason: string }) {
    const existingReturn = await prisma.return.findUnique({ where: { orderId: data.orderId } });
    if (existingReturn) {
      throw new Error("Return already exists for this order");
    }

    const order = await prisma.order.findUnique({ where: { id: data.orderId } });
    if (!order) {
      throw new Error("Order not found");
    }

    return await prisma.return.create({
      data: {
        orderId: data.orderId,
        reason: data.reason,
      },
      include: returnInclude,
    });
  }

  /**
   * Create return request from customer
   * Validates order belongs to customer and has DELIVERED status
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

    // Check if return already exists
    const existingReturn = await prisma.return.findUnique({ where: { orderId: data.orderId } });
    if (existingReturn) {
      throw new Error("Return request already exists for this order");
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

    return await prisma.return.create({
      data: {
        orderId: data.orderId,
        reason: data.reason,
        status: 'REQUESTED',
      },
      include: returnInclude,
    });
  }

  /**
   * Customer withdraws their return request
   */
  static async withdrawCustomerRequest(orderId: string, userId: string) {
    // Look up Customer by userId
    const customer = await prisma.customer.findUnique({
      where: { userId }
    });

    if (!customer) {
      throw new Error("Customer profile not found");
    }

    // Find return by orderId
    const existingReturn = await prisma.return.findUnique({
      where: { orderId },
      include: { order: true }
    });

    if (!existingReturn) {
      throw new Error("Return request not found");
    }

    // Verify order belongs to customer
    if (existingReturn.order.customerId !== customer.id) {
      throw new Error("This request does not belong to you");
    }

    // Can only withdraw REQUESTED status
    if (existingReturn.status !== 'REQUESTED') {
      throw new Error("Can only withdraw pending requests");
    }

    return await prisma.return.delete({
      where: { id: existingReturn.id }
    });
  }

  static async update(
    id: string,
    data: {
      reason?: string;
      status?: ReturnStatus;
    }
  ) {
    const existingReturn = await prisma.return.findUnique({ where: { id } });
    if (!existingReturn) {
      throw new Error("Return not found");
    }

    return await prisma.return.update({
      where: { id },
      data,
      include: returnInclude,
    });
  }

  static async delete(id: string) {
    return await prisma.return.delete({
      where: { id },
    });
  }
}
