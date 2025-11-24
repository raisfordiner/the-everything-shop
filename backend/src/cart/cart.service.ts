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

  static async addCartItem(data: { cartId: string; customerId: string; productVariantId: string; quantity: number }) {
    const customer = await prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const productVariant = await prisma.productVariant.findUnique({
      where: { id: data.productVariantId },
    });

    if (!productVariant) {
      throw new Error("Product variant not found");
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: data.cartId,
        customerId: data.customerId,
        productVariantId: data.productVariantId,
        quantity: data.quantity,
      },
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

  static async deleteCartItem(cartItemId: string) {
    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }
}
