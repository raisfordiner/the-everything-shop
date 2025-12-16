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

    if (!cart) {
        throw new Error("Cart not found");
    }

    const productVariant = await prisma.productVariant.findUnique({
      where: { id: data.productVariantId },
    });

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
    paymentMethod: "COD" | "VNPAY";
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
          method: data.paymentMethod,
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

      return {
        ...newOrder,
        orderItems,
        payment,
      };
    });



    // Return the complete order with details
    return await prisma.order.findUnique({
      where: { id: order.id },
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
  }
}
