import { prisma } from "util/db";
import { MembershipStatus } from "@prisma/client";
import { logger } from "util/logger";

const include = {
  customer: {
    include: {
      user: true,
    },
  },
};

function getMembership(spent: number) {
  if (spent < 100) {
    return MembershipStatus.BRONZE;
  }

  if (spent < 500) {
    return MembershipStatus.SILVER;
  }

  return MembershipStatus.GOLD;
}

export default class MembershipService {
  static async find(id?: string, membership?: MembershipStatus) {
    if (id) {
      return await prisma.membership.findUnique({
        where: { id },
        include: include,
      });
    }

    const where: any = {
      membership: membership || undefined,
    };

    return await prisma.membership.findMany({
      where,
      include: include,
    });
  }

  static async findByUserId(userId: string) {
    try {
      return await prisma.membership.findFirst({
        where: {
          customer: {
            userId: userId,
          },
        },
        include: include,
      });
    } catch (error: any) {
      logger.error({
        msg: "Prisma error in findByUserId",
        userId,
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      });
      throw error;
    }
  }

  static async create(data: { customerId: string; spent: number }) {
    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
    if (!customer) {
      throw new Error("Customer not found");
    }

    const existingMembership = await prisma.membership.findFirst({
      where: { customerId: data.customerId },
    });
    if (existingMembership) {
      throw new Error("Customer already has a membership");
    }

    return await prisma.membership.create({
      data: {
        customerId: data.customerId,
        membership: getMembership(data.spent),
        spent: data.spent,
      },
      include: include,
    });
  }

  static async update(
    id: string,
    data: {
      customerId?: string;
      spent?: number;
    }
  ) {
    if (data.customerId) {
      const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
      if (!customer) {
        throw new Error("Customer not found");
      }

      const existingMembership = await prisma.membership.findFirst({
        where: { customerId: data.customerId },
      });

      if (existingMembership && existingMembership.id !== id) {
        throw new Error("Customer already has a membership");
      }
    }

    return await prisma.membership.update({
      where: { id },
      data: {
        customerId: data.customerId,
        membership: getMembership(data.spent),
        spent: data.spent,
      },
      include: include,
    });
  }

  static async delete(id: string) {
    return await prisma.membership.delete({
      where: { id },
    });
  }
}
