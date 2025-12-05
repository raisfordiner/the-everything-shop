import { prisma } from "util/db";

export default class ReviewsService {
  static async find(id?: string, q?: string, customerId?: string, minRating?: number, maxRating?: number) {
    const selectList = {
      id: true,
      rating: true,
      comment: true,
      images: true,
      reviewDate: true,
      orderItemId: true,
      customerId: true, // có nên trả id của customer cho client?
      createdAt: true,
      updatedAt: true,
    };

    if (id) {
      return await prisma.review.findUnique({
        where: { id },
        select: selectList,
      });
    }

    return await prisma.review.findMany({
      where: {
        comment: q ? { contains: q, mode: "insensitive" } : undefined,
        customerId: customerId || undefined,
        rating: {
          gte: minRating,
          lte: maxRating,
        },
      },
      select: selectList,
    });
  }

  static async create(data: {
    rating: number;
    comment?: string;
    images?: string[];
    orderItemId: string;
  }) {
    const existingReview = await prisma.review.findUnique({
      where: { orderItemId: data.orderItemId },
    });

    if (existingReview) {
      throw new Error("Review already exists for this order item");
    }

    console.log("got this 54");

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: data.orderItemId },
      include: { order: true },
    });

    if (!orderItem) {
      throw new Error("Order item not found");
    }

    const customerId = orderItem.order.customerId;


    return await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        images: data.images || [],
        orderItemId: data.orderItemId,
        customerId,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        images: true,
        reviewDate: true,
        orderItemId: true,
        customerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async update(
    id: string,
    data: {
      rating?: number;
      comment?: string;
      images?: string[];
    }
  ) {
    return await prisma.review.update({
      where: { id },
      data,
      select: {
        id: true,
        rating: true,
        comment: true,
        images: true,
        reviewDate: true,
        orderItemId: true,
        customerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.review.delete({
      where: { id },
    });
  }
}
