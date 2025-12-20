import { prisma } from "util/db";
import { MembershipStatus } from "@prisma/client";

export default class MembershipService {
  static async find(id?: string, q?: string, customerId?: string, membership?: MembershipStatus) {
    if (id) {
      return await prisma.membership.findUnique({
        where: { id },
        include: {
          customer: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }

    const where: any = {
      customerId: customerId || undefined,
      membership: membership || undefined,
    };

    if (q) {
      const spentValue = parseFloat(q);
      if (!isNaN(spentValue)) {
        where.spent = spentValue;
      } else if (["BRONZE", "SILVER", "GOLD"].includes(q.toUpperCase())) {
        where.membership = q.toUpperCase() as MembershipStatus;
      }
    }

    return await prisma.membership.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  static async create(data: { customerId: string; membership: MembershipStatus; spent: number }) {
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
        membership: data.membership,
        spent: data.spent,
      },
      include: {
        customer: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  static async update(
    id: string,
    data: {
      customerId?: string;
      membership?: MembershipStatus;
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

      // Có cập nhật spent
      // Không cập nhật membership
      if (data.spent != existingMembership.spent && !data.membership) {
        if (data.spent < 100_000) {
          data.membership = MembershipStatus.BRONZE;
        }

        if (data.spent < 500_000) {
          data.membership = MembershipStatus.SILVER;
        }

        if (data.spent > 2_000_000) {
          data.membership = MembershipStatus.GOLD;
        }
      }
    }

    return await prisma.membership.update({
      where: { id },
      data,
      include: {
        customer: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.membership.delete({
      where: { id },
    });
  }
}
