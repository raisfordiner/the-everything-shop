import { prisma } from "util/db";

export default class OrderService {
  static async createDirectOrder(customerId: string, addressId: string, productVariantId: string, quantity: number) {
    // Validate product variant and stock
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
      include: {
        product: true,
      },
    });

    if (!productVariant) {
      throw new Error("Product variant not found");
    }

    if (productVariant.quantity < quantity) {
      throw new Error(`Insufficient stock. Only ${productVariant.quantity} items available`);
    }

    // Create order directly without cart
    const order = await prisma.$transaction(async (tx) => {
      // Decrease product variant quantity
      await tx.productVariant.update({
        where: { id: productVariantId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      // Create order with order item
      return await tx.order.create({
        data: {
          customerId,
          addressId,
          orderItems: {
            create: [{
              productVariantId,
              quantity,
            }],
          },
        } as any,
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
    });

    return order;
  }

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
      } as any,
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

  static async find(id?: string, customerId?: string, status?: string) {
    const include = {
      orderItems: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
          review: true,
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
    if (status) {
      where.status = status as any;
    }

    return await prisma.order.findMany({
      where,
      include,
      orderBy: { orderDate: "desc" },
    });
  }

  static async updateStatus(id: string, status: string) {
    if (!["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) {
      throw new Error("Invalid status");
    }

    if (status === "CANCELLED") {
      // Add stock back to product variants
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: id },
      });
      for (const item of orderItems) {
        await prisma.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }
    }

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
