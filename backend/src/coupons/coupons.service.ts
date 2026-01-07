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

  /**
   * Find available coupons for given product variants
   * Returns coupons from active promotions that apply to the products
   */
  static async findAvailable(productVariantIds: string[]) {
    // Get products from variants
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: productVariantIds } },
      select: {
        product: {
          select: {
            id: true,
            categoryId: true,
          },
        },
      },
    });

    const productIds = variants.map((v) => v.product.id);
    const categoryIds = [...new Set(variants.map((v) => v.product.categoryId))];

    // Find active promotions that apply to these products or their categories
    const now = new Date();
    const promotions = await prisma.promotion.findMany({
      where: {
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
        OR: [
          { appliedProducts: { some: { id: { in: productIds } } } },
          { appliedCategories: { some: { id: { in: categoryIds } } } },
        ],
      },
      include: {
        coupons: {
          where: {
            usageCount: { lt: prisma.coupon.fields.maxUsage },
          },
        },
      },
    });

    // Flatten coupons from all applicable promotions
    const coupons = promotions.flatMap((p) =>
      p.coupons.map((c) => ({
        ...c,
        promotionName: p.name,
        promotionEndDate: p.endDate,
      }))
    );

    return coupons;
  }

  /**
   * Validate a coupon code and check if it's applicable
   */
  static async validateCoupon(code: string, productVariantIds: string[]) {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
      include: {
        promotion: {
          include: {
            appliedProducts: { select: { id: true } },
            appliedCategories: { select: { id: true } },
          },
        },
      },
    });

    if (!coupon) {
      return { valid: false, error: "Coupon not found" };
    }

    // Check if promotion is active
    const now = new Date();
    if (
      coupon.promotion.status !== "ACTIVE" ||
      coupon.promotion.startDate > now ||
      coupon.promotion.endDate < now
    ) {
      return { valid: false, error: "Coupon has expired or is not active" };
    }

    // Check usage limit
    if (coupon.usageCount >= coupon.maxUsage) {
      return { valid: false, error: "Coupon usage limit reached" };
    }

    // Get products from variants
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: productVariantIds } },
      select: {
        product: {
          select: {
            id: true,
            categoryId: true,
          },
        },
      },
    });

    const productIds = variants.map((v) => v.product.id);
    const categoryIds = [...new Set(variants.map((v) => v.product.categoryId))];

    // Check if coupon applies to any of the products
    const appliedProductIds = coupon.promotion.appliedProducts.map((p) => p.id);
    const appliedCategoryIds = coupon.promotion.appliedCategories.map((c) => c.id);

    const productMatch = productIds.some((id) => appliedProductIds.includes(id));
    const categoryMatch = categoryIds.some((id) => appliedCategoryIds.includes(id));

    if (!productMatch && !categoryMatch && appliedProductIds.length > 0) {
      return { valid: false, error: "Coupon does not apply to selected products" };
    }

    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        promotionName: coupon.promotion.name,
      },
    };
  }
}
