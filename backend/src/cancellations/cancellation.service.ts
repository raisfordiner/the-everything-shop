import { prisma } from "util/db";
import { CancellationStatus } from "@prisma/client";

export default class CancellationService {
  static async find(id?: string, q?: string, orderId?: string, status?: CancellationStatus) {
    if (id) {
      return await prisma.cancellation.findUnique({
        where: { id },
        include: {
          order: {
            select: {
              id: true,
              customerId: true,
              status: true,
              orderDate: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    }

    return await prisma.cancellation.findMany({
      where: {
        OR: q ? [{ reason: { contains: q, mode: "insensitive" } }] : undefined,
        orderId: orderId || undefined,
        status: status || undefined,
      },
      include: {
        order: {
          select: {
            id: true,
            customerId: true,
            status: true,
            orderDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
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
      include: {
        order: {
          select: {
            id: true,
            customerId: true,
            status: true,
            orderDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  static async update(id: string, data: { reason?: string; status?: CancellationStatus }) {
    const cancellation = await prisma.cancellation.findUnique({ where: { id } });
    if (!cancellation) {
      throw new Error("Cancellation not found");
    }

    return await prisma.cancellation.update({
      where: { id },
      data,
      include: {
        order: {
          select: {
            id: true,
            customerId: true,
            status: true,
            orderDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.cancellation.delete({
      where: { id },
    });
  }
}
