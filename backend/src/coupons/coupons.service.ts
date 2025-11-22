import { prisma } from "util/db";

export default class CouponsService {
  static async find(id?: string, q?: string, promotionId?: string) {
    if (id) {
      return await prisma.coupon.findUnique({
        where: { id },
        include: {
          promotion: {
            select: {
              id: true,
              name: true,
              description: true,
              startDate: true,
              endDate: true,
              status: true,
            },
          },
        },
      });
    }

    return await prisma.coupon.findMany({
      where: {
        OR: q ? [{ code: { contains: q, mode: "insensitive" } }] : undefined,
        promotionId: promotionId || undefined,
      },
      include: {
        promotion: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });
  }

  static async create(data: { promotionId: string; code: string; discountPercentage: number; maxUsage: number }) {
    const existingCoupon = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }

    const promotion = await prisma.promotion.findUnique({ where: { id: data.promotionId } });
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    return await prisma.coupon.create({
      data: {
        promotionId: data.promotionId,
        code: data.code,
        discountPercentage: data.discountPercentage,
        maxUsage: data.maxUsage,
      },
      include: {
        promotion: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });
  }

  static async update(
    id: string,
    data: {
      promotionId?: string;
      code?: string;
      discountPercentage?: number;
      maxUsage?: number;
      usageCount?: number;
    }
  ) {
    if (data.code) {
      const existingCoupon = await prisma.coupon.findUnique({
        where: { code: data.code },
      });

      if (existingCoupon && existingCoupon.id !== id) {
        throw new Error("Coupon code already exists");
      }
    }

    if (data.promotionId) {
      const promotion = await prisma.promotion.findUnique({ where: { id: data.promotionId } });
      if (!promotion) {
        throw new Error("Promotion not found");
      }
    }

    return await prisma.coupon.update({
      where: { id },
      data,
      include: {
        promotion: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.coupon.delete({
      where: { id },
    });
  }
}
