import { prisma } from "util/db";
import { Prisma, Promotion, PromotionStatus, ClearanceLevel } from "@prisma/client";

export default class PromotionService {
  /**
   * Get all promotions with optional filtering and pagination
   */
  static async getAllPromotions(
    skip: number = 0,
    take: number = 10,
    status?: PromotionStatus,
    searchTerm?: string
  ): Promise<{
    promotions: Promotion[];
    pagination: {
      total: number;
      skip: number;
      take: number;
      pages: number;
    };
  }> {
    const where: Prisma.PromotionWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
        skip,
        take,
        include: {
          admin: {
            select: {
              id: true,
              user: {
                select: {
                  username: true,
                  email: true,
                },
              },
            },
          },
          coupons: true,
          clearanceEvents: true,
          appliedProducts: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          appliedCategories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.promotion.count({ where }),
    ]);

    return {
      promotions,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get a single promotion by ID
   */
  static async getPromotionById(promotionId: string): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        admin: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        coupons: true,
        clearanceEvents: true,
        appliedProducts: {
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
          },
        },
        appliedCategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    return promotion;
  }

  /**
   * Create a new promotion (Admin only)
   */
  static async createPromotion(
    name: string,
    description: string | undefined,
    startDate: Date,
    endDate: Date,
    adminId: string,
    status: PromotionStatus = PromotionStatus.ACTIVE,
    appliedProducts: string[] = [],
    appliedCategories: string[] = [],
    coupons: Array<{ code: string; discountPercentage: number; maxUsage: number }> = [],
    clearanceEvents: Array<{ clearanceLevel: ClearanceLevel }> = []
  ): Promise<Promotion> {
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    // Verify products exist
    if (appliedProducts.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: appliedProducts } },
      });

      if (products.length !== appliedProducts.length) {
        throw new Error("One or more products not found");
      }
    }

    // Verify categories exist
    if (appliedCategories.length > 0) {
      const categories = await prisma.category.findMany({
        where: { id: { in: appliedCategories } },
      });

      if (categories.length !== appliedCategories.length) {
        throw new Error("One or more categories not found");
      }
    }

    const promotion = await prisma.promotion.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy: adminId,
        status,
        appliedProducts: {
          connect: appliedProducts.map((id) => ({ id })),
        },
        appliedCategories: {
          connect: appliedCategories.map((id) => ({ id })),
        },
        coupons: {
          create: coupons,
        },
        clearanceEvents: {
          create: clearanceEvents,
        },
      },
      include: {
        admin: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        coupons: true,
        clearanceEvents: true,
        appliedProducts: {
          select: {
            id: true,
            name: true,
          },
        },
        appliedCategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return promotion;
  }

  /**
   * Update a promotion
   */
  static async updatePromotion(
    promotionId: string,
    updateData: {
      name?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      status?: PromotionStatus;
    }
  ): Promise<Promotion> {
    // Verify promotion exists
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      },
      include: {
        admin: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        coupons: true,
        clearanceEvents: true,
        appliedProducts: {
          select: {
            id: true,
            name: true,
          },
        },
        appliedCategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedPromotion;
  }

  /**
   * Delete a promotion
   */
  static async deletePromotion(promotionId: string): Promise<{ message: string }> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    await prisma.promotion.delete({
      where: { id: promotionId },
    });

    return { message: "Promotion deleted successfully" };
  }

  /**
   * Apply products to a promotion
   */
  static async applyProducts(promotionId: string, productIds: string[]): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    // Verify products exist
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more products not found");
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        appliedProducts: {
          connect: productIds.map((id) => ({ id })),
        },
      },
      include: {
        admin: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        coupons: true,
        clearanceEvents: true,
        appliedProducts: {
          select: {
            id: true,
            name: true,
          },
        },
        appliedCategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedPromotion;
  }

  /**
   * Apply categories to a promotion
   */
  static async applyCategories(promotionId: string, categoryIds: string[]): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    // Verify categories exist
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
      throw new Error("One or more categories not found");
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        appliedCategories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
      include: {
        admin: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        coupons: true,
        clearanceEvents: true,
        appliedProducts: {
          select: {
            id: true,
            name: true,
          },
        },
        appliedCategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedPromotion;
  }

  /**
   * Remove products from a promotion
   */
  static async removeProducts(promotionId: string, productIds: string[]): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        appliedProducts: {
          disconnect: productIds.map((id) => ({ id })),
        },
      },
      include: {
        admin: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        coupons: true,
        clearanceEvents: true,
        appliedProducts: {
          select: {
            id: true,
            name: true,
          },
        },
        appliedCategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedPromotion;
  }

  /**
   * Remove categories from a promotion
   */
  static async removeCategories(promotionId: string, categoryIds: string[]): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        appliedCategories: {
          disconnect: categoryIds.map((id) => ({ id })),
        },
      },
      include: {
        admin: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        coupons: true,
        clearanceEvents: true,
        appliedProducts: {
          select: {
            id: true,
            name: true,
          },
        },
        appliedCategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedPromotion;
  }

  /**
   * Add coupon to promotion
   */
  static async addCoupon(
    promotionId: string,
    code: string,
    discountPercentage: number,
    maxUsage: number
  ): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        coupons: {
          create: {
            code,
            discountPercentage,
            maxUsage,
          },
        },
      },
      include: {
        coupons: true,
      },
    });

    return updatedPromotion;
  }

  /**
   * Add clearance event to promotion
   */
  static async addClearanceEvent(promotionId: string, clearanceLevel: ClearanceLevel): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        clearanceEvents: {
          create: {
            clearanceLevel,
          },
        },
      },
      include: {
        clearanceEvents: true,
      },
    });

    return updatedPromotion;
  }

  /**
   * Get active promotions
   */
  static async getActivePromotions(skip: number = 0, take: number = 10): Promise<{
    promotions: Promotion[];
    pagination: {
      total: number;
      skip: number;
      take: number;
      pages: number;
    };
  }> {
    const now = new Date();

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where: {
          status: PromotionStatus.ACTIVE,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        skip,
        take,
        include: {
          coupons: true,
          appliedProducts: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          appliedCategories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.promotion.count({
        where: {
          status: PromotionStatus.ACTIVE,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
    ]);

    return {
      promotions,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }
}
