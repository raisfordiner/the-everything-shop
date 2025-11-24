import { prisma } from "util/db";

export default class CartService {
  static async find(id?: string, customerID?: string) {
    const include = {
      cartItems: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    };

    if (id) {
      return await prisma.cart.findUnique({
        where: { id },
        include,
      });
    }

    const where: any = {};
    if (customerID) {
      where.customerId = customerID;
    }

    return await prisma.cart.findMany({
      where,
      include,
    });
  }

  static async create(data: { customerId: string }) {
    const existingCart = await prisma.cart.findUnique({
      where: { customerId: data.customerId },
    });

    if (existingCart) {
      throw new Error("Cart already exists for this customer");
    }

    return await prisma.cart.create({
      data: {
        customerId: data.customerId,
      },
      include: {
        cartItems: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.cart.delete({
      where: { id },
    });
  }
}
