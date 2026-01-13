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
      // Get order with payment info
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          payment: true,
          orderItems: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // Only restore stock if payment was successful (stock was decremented)
      // For COD: stock is decremented at checkout
      // For Stripe: stock is decremented after payment success
      const shouldRestoreStock =
        order.payment?.method === 'COD' ||
        (order.payment?.method === 'STRIPE' && order.payment?.status === 'SUCCESS');

      if (shouldRestoreStock) {
        for (const item of order.orderItems) {
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

      // Reverse membership spent if payment was successful
      if (order.payment?.status === 'SUCCESS') {
        const membership = await prisma.membership.findFirst({
          where: { customerId: order.customerId },
        });

        if (membership) {
          const newSpent = Math.max(0, membership.spent - order.payment.amount);
          let newTier = membership.membership;

          // Determine new tier based on updated spent amount
          if (newSpent >= 500) {
            newTier = 'GOLD';
          } else if (newSpent >= 100) {
            newTier = 'SILVER';
          } else {
            newTier = 'BRONZE';
          }

          await prisma.membership.update({
            where: { id: membership.id },
            data: {
              spent: newSpent,
              membership: newTier as any,
            },
          });
        }
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
        payment: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.order.delete({
      where: { id },
    });
  }
}
