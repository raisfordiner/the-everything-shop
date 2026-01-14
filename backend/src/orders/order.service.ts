import { prisma } from "util/db";
import Stripe from "stripe";

export default class OrderService {
  static async createDirectOrder(
    customerId: string,
    addressId: string,
    productVariantId: string,
    quantity: number,
    paymentMethod: "COD" | "VNPAY" | "STRIPE" = "COD"
  ) {
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

    // Calculate total amount
    const unitPrice = productVariant.product.price + productVariant.priceAdjustment;
    const totalAmount = unitPrice * quantity;

    // Create order directly without cart
    const order = await prisma.$transaction(async (tx) => {
      // Only decrease stock for COD orders; Stripe decrements after payment confirmation
      if (paymentMethod === "COD") {
        await tx.productVariant.update({
          where: { id: productVariantId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });
      }

      // Create order with order item
      const newOrder = await tx.order.create({
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

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: totalAmount,
          method: paymentMethod as any,
          status: "PENDING",
        },
      });

      return newOrder;
    });

    // Handle Stripe payment
    if (paymentMethod === "STRIPE") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
      const frontendUrl = process.env.FE_URL || "http://localhost:3000";
      const successUrl = `${frontendUrl}/loading?orderId=${order.id}`;
      const cancelUrl = `${frontendUrl}/product/${productVariant.productId}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: productVariant.product.name,
            },
            unit_amount: Math.round(unitPrice * 100), // Stripe uses cents
          },
          quantity: quantity,
        }],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderId: order.id,
        },
      });

      return {
        ...order,
        stripeSessionUrl: session.url,
      };
    }

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
      return: true,
      cancellation: true,
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

    const updatedOrder = await prisma.order.update({
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

    return updatedOrder;
  }

  static async delete(id: string) {
    return await prisma.order.delete({
      where: { id },
    });
  }
}
