import { prisma } from "util/db";

export default class OrderService {
  static async create(customerId: string, addressId: string) {
    // 1. READ Cart with all Cart Items
    const cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        cartItems: {
          include: {
            productVariant: true,
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2. CREATE Order
    const order = await prisma.order.create({
      data: {
        customerId,
        addressId,
        // 3. For each Cart Item: CREATE Order Item
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
        address: true,
      },
    });

    // 4. DELETE all Cart Items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // 5. Return Order
    return order;
  }

  static async find(id?: string, customerId?: string) {
    const include = {
      orderItems: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
      address: true,
      payment: true,
    };

    if (id) {
      return await prisma.order.findUnique({
        where: { id },
        include,
      });
    }

    const where: any = {};
    if (customerId) {
      where.customerId = customerId;
    }

    return await prisma.order.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateStatus(id: string, status: string) {
    return await prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        orderItems: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
        address: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.order.delete({
      where: { id },
    });
  }
}
