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
