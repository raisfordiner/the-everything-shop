import Stripe from "stripe";
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

  static async addCartItem(data: { cartId: string; productVariantId: string; quantity: number }) {
    const cart = await prisma.cart.findUnique({
      where: { id: data.cartId },
    });
    console.log("cart", cart);
    if (!cart) {
        throw new Error("Cart not found");
    }

    const productVariant = await prisma.productVariant.findUnique({
      where: { id: data.productVariantId },
    });

    console.log(productVariant);

    if (!productVariant) {
      throw new Error("Product variant not found");
    }

    // Check if cart item already exists
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: data.cartId,
        productVariantId: data.productVariantId,
      },
    });

    console.log(existingCartItem);

    if (existingCartItem) {
      // Update quantity if item already exists
      return await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + data.quantity },
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Create new cart item using unchecked input
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: data.cartId,
        productVariantId: data.productVariantId,
        quantity: data.quantity,
      } as any,
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(cartItem);
    return cartItem;
  }

  static async getCartItem(cartItemId: string) {
    return await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async updateCartItem(cartItemId: string, quantity: number) {
    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async deleteCartItem(cartItemId: string) {
    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  static async checkout(data: {
    customerId: string;
    cartItemIds: string[];
    addressId: string;
    paymentMethod: "COD" | "VNPAY" | "STRIPE";
  }) {
    // Validate cart items exist and belong to customer's cart
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: data.cartItemIds },
        cart: { customerId: data.customerId },
      },
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    });

    if (cartItems.length !== data.cartItemIds.length) {
      throw new Error("Some cart items not found or do not belong to this customer");
    }

    // Validate address belongs to customer
    const address = await prisma.address.findFirst({
      where: {
        id: data.addressId,
        customerId: data.customerId,
      },
    });

    if (!address) {
      throw new Error("Address not found or does not belong to this customer");
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      const basePrice = item.productVariant.product.price;
      const finalPrice = basePrice + item.productVariant.priceAdjustment;
      return sum + finalPrice * item.quantity;
    }, 0);

    // Create order with order items and payment in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          customerId: data.customerId,
          addressId: data.addressId,
          status: "PENDING",
        } as any,
      });

      // Create order items
      const orderItems = await Promise.all(
        cartItems.map((cartItem) =>
          tx.orderItem.create({
            data: {
              order: {
                connect: { id: newOrder.id },
              },
              productVariant: {
                connect: { id: cartItem.productVariantId },
              },
              quantity: cartItem.quantity,
            },
          })
        )
      );

      // Create payment
      const payment = await tx.payment.create({
        data: {
          order: {
            connect: { id: newOrder.id },
          },
          amount: totalAmount,
          method: data.paymentMethod as any,
          status: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
        },
      });

      // Subtract stock quantities
      await Promise.all(
        cartItems.map((cartItem) =>
          tx.productVariant.update({
            where: { id: cartItem.productVariantId },
            data: {
              quantity: { decrement: cartItem.quantity },
            },
          })
        )
      );

      // Delete the cart items that were checked out
      await tx.cartItem.deleteMany({
        where: {
          id: { in: data.cartItemIds },
        },
      });

      if (data.paymentMethod === "STRIPE") {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Order #${newOrder.id}`,
              },
              unit_amount: Math.round(totalAmount * 100),
            },
            quantity: 1,
          }],
          expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/loading?orderId=${newOrder.id}`,
          cancel_url: `${process.env.FRONTEND_URL}/cart`,
          metadata: {
            orderIds: newOrder.id,
            userId: data.customerId,
            appId: 'the-everything-shop',
          }
        })
        return { session, orderId: newOrder.id };
      }

      return {
        ...newOrder,
        orderItems,
        payment,
      };
    });



    // Return the complete order with details
    const orderId = 'session' in order ? order.orderId : order.id;
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
        payment: true,
        address: true,
      },
    });

    // If Stripe session exists, return it with the order
    if ('session' in order) {
      return {
        ...fullOrder,
        stripeSessionUrl: order.session.url,
      };
    }

    return fullOrder;
  }
}
