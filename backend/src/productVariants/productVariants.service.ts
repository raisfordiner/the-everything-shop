import { prisma } from "util/db";
import { Prisma, ProductVariant } from "@prisma/client";

export default class ProductVariantService {
  /**
   * Get all product variants with optional filtering and pagination
   */
  static async getAllProductVariants(
    skip: number = 0,
    take: number = 10,
    productId?: string,
    searchTerm?: string
  ): Promise<{
    productVariants: ProductVariant[];
    pagination: {
      total: number;
      skip: number;
      take: number;
      pages: number;
    };
  }> {
    const where: Prisma.ProductVariantWhereInput = {};

    if (productId) {
      where.productId = productId;
    }

    // Note: SearchTerm not directly applicable to ProductVariant but included for future use
    // JSON search would require a different approach with raw queries

    const [productVariants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        skip,
        take,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              category: true,
            },
          },
          cartItems: true,
          orderItems: true,
        },
      }),
      prisma.productVariant.count({ where }),
    ]);

    return {
      productVariants,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get a single product variant by ID
   */
  static async getProductVariantById(variantId: string): Promise<ProductVariant> {
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
            seller: {
              select: {
                id: true,
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
        cartItems: true,
        orderItems: true,
      },
    });

    if (!productVariant) {
      throw new Error("Product variant not found");
    }

    return productVariant;
  }

  /**
   * Create a new product variant
   */
  static async createProductVariant(
    productId: string,
    quantity: number,
    variantAttributes: Record<string, string>,
    images: string[] = [],
    priceAdjustment: number = 0
  ): Promise<ProductVariant> {
    // Verify product exists
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        is_deleted: false,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const productVariant = await prisma.productVariant.create({
      data: {
        productId,
        quantity,
        variantAttributes,
        images,
        priceAdjustment,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
          },
        },
      },
    });

    return productVariant;
  }

  /**
   * Update a product variant
   */
  static async updateProductVariant(
    variantId: string,
    userContext: { userId: string; role: string; sellerId?: string },
    updateData: {
      quantity?: number;
      variantAttributes?: Record<string, string>;
      images?: string[];
      priceAdjustment?: number;
    }
  ): Promise<ProductVariant> {
    // Verify product variant exists
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
      },
    });

    if (!productVariant) {
      throw new Error("Product variant not found");
    }

    // Check authorization: allow if user is admin OR if user is the product creator (seller)
    if (userContext.role === "SELLER") {
      const product = await prisma.product.findUnique({
        where: { id: productVariant.productId },
      });

      const isProductCreator = userContext.sellerId && product?.createdBy === userContext.sellerId;

      if (!isProductCreator) {
        throw new Error("You are not authorized to update this product variant");
      }
    }

    const updatedProductVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
          },
        },
      },
    });

    return updatedProductVariant;
  }

  /**
   * Delete a product variant
   */
  static async deleteProductVariant(
    variantId: string,
    userContext: { userId: string; role: string; sellerId?: string }
  ): Promise<{ message: string }> {
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
      },
    });

    if (!productVariant) {
      throw new Error("Product variant not found");
    }

    // Check authorization: allow if user is admin OR if user is the product creator (seller)
    if (userContext.role === "SELLER") {
      const product = await prisma.product.findUnique({
        where: { id: productVariant.productId },
      });

      const isProductCreator = userContext.sellerId && product?.createdBy === userContext.sellerId;

      if (!isProductCreator) {
        throw new Error("You are not authorized to delete this product variant");
      }
    }

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    return { message: "Product variant deleted successfully" };
  }

  /**
   * Get product variants by product ID
   */
  static async getProductVariantsByProductId(
    productId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{
    productVariants: ProductVariant[];
    pagination: {
      total: number;
      skip: number;
      take: number;
      pages: number;
    };
  }> {
    // Verify product exists
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        is_deleted: false,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const [productVariants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where: { productId },
        skip,
        take,
        include: {
          cartItems: true,
          orderItems: true,
        },
      }),
      prisma.productVariant.count({ where: { productId } }),
    ]);

    return {
      productVariants,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Update product variant quantity
   */
  static async updateQuantity(variantId: string, quantity: number): Promise<ProductVariant> {
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!productVariant) {
      throw new Error("Product variant not found");
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { quantity },
    });

    return updatedVariant;
  }
}
