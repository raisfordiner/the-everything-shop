import Stripe from "stripe";
import { prisma } from "util/db";

export default class OrderService {
  static async createDirectOrder(
    customerId: string, 
    addressId: string, 
    productVariantId: string, 
    quantity: number,
    paymentMethod: 'COD' | 'VNPAY' | 'STRIPE' = 'COD'
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

    // Validate address belongs to customer
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        customerId: customerId,
      },
    });

    if (!address) {
      throw new Error("Address not found or does not belong to this customer");
    }

    // Calculate total amount
    const basePrice = productVariant.product.price;
    const totalAmount = (basePrice + productVariant.priceAdjustment) * quantity;

    // Create order directly without cart
    const result = await prisma.$transaction(async (tx) => {
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
      const newOrder = await tx.order.create({
        data: {
          customerId,
          addressId,
          status: "PENDING",
          orderItems: {
            create: [{
              productVariantId,
              quantity,
            }],
          },
        } as any,
      });

      // Create payment
      const payment = await tx.payment.create({
        data: {
          order: {
            connect: { id: newOrder.id },
          },
          amount: totalAmount,
          method: paymentMethod as any,
          status: paymentMethod === "COD" ? "PENDING" : "PENDING",
        },
      });

      // Handle Stripe payment
      if (paymentMethod === "STRIPE") {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: productVariant.product.name,
              },
              unit_amount: Math.round((basePrice + productVariant.priceAdjustment) * 100),
            },
            quantity: quantity,
          }],
          expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/loading?orderId=${newOrder.id}`,
          cancel_url: `${process.env.FRONTEND_URL}/products/${productVariant.product.id}`,
          metadata: {
            orderIds: newOrder.id,
            userId: customerId,
            appId: 'the-everything-shop',
          }
        });
        return { session, orderId: newOrder.id };
      }

      return {
        ...newOrder,
        payment,
      };
    });

    // Return the complete order with details
    const orderId = 'session' in result ? result.orderId : result.id;
    const fullOrder = await prisma.order.findUnique({
      where: { id: orderId },
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

    // If Stripe session exists, return it with the order
    if ('session' in result) {
      return {
        ...fullOrder,
        stripeSessionUrl: result.session.url,
      };
    }

    return fullOrder;
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
