import { prisma } from "util/db";
import { Prisma, Product } from "@prisma/client";

export default class ProductService {
  /**
   * Get all products with optional filtering and pagination
   */
  static async getAllProducts(
    skip: number = 0,
    take: number = 10,
    categoryId?: string,
    searchTerm?: string,
    sortBy: "name" | "price" | "rating" = "name",
    sortOrder: "asc" | "desc" = "asc",
    minPrice?: number,
    maxPrice?: number,
    minRating?: number
  ): Promise<{
    products: any[];
    pagination: {
      total: number;
      skip: number;
      take: number;
      pages: number;
    };
  }> {
    const where: Prisma.ProductWhereInput = {
      is_deleted: false,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any = {};
    if (sortBy === "name" || sortBy === "price") {
      orderBy[sortBy] = sortOrder;
    }

    // Since we need to calculate stats and potentially filter by rating, 
    // we fetch matching products without skip/take initially if minRating or rating sort is used.
    // However, to keep it simple and performant, we'll fetch all matching products (within reason),
    // enrich them, filter by rating, sort, then apply skip/take.
    const allMatchingProducts = await prisma.product.findMany({
      where,
      orderBy: sortBy !== "rating" ? [orderBy] : undefined,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        productVariants: {
          include: {
            orderItems: {
              include: {
                order: true,
                review: true,
              },
            },
          },
        },
        promotions: true,
      },
    });

    let enrichedProducts = allMatchingProducts.map(product => {
      const allOrderItems = product.productVariants.flatMap(v => v.orderItems);
      const soldCount = allOrderItems
        .filter(oi => oi.order.status === "SHIPPED" || oi.order.status === "DELIVERED")
        .reduce((sum, oi) => sum + oi.quantity, 0);

      const reviews = allOrderItems
        .map(oi => oi.review)
        .filter(r => r !== null);

      const reviewCount = reviews.length;
      const averageRating = reviewCount > 0
        ? reviews.reduce((sum, r) => sum + (r?.rating || 0), 0) / reviewCount
        : 0;

      return {
        ...product,
        soldCount,
        reviewCount,
        averageRating: parseFloat(averageRating.toFixed(1)),
      };
    });

    // 2. Filter by minRating
    if (minRating !== undefined) {
      enrichedProducts = enrichedProducts.filter(p => p.averageRating >= minRating);
    }

    // 3. Custom sort for Rating
    if (sortBy === "rating") {
      enrichedProducts.sort((a, b) => {
        return sortOrder === "asc" ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
      });
    }

    const total = enrichedProducts.length;
    const paginatedProducts = enrichedProducts.slice(skip, skip + take);

    return {
      products: paginatedProducts,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(productId: string): Promise<Product> {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        is_deleted: false,
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        productVariants: {
          include: {
            cartItems: true,
            orderItems: true,
          },
        },
        promotions: true,
      },
    });

    if (!product) {
      throw new Error("Product not found or has been deleted");
    }

    return product;
  }

  /**
   * Create a new product (Seller only)
   */
  static async createProduct(
    name: string,
    description: string,
    price: number,
    stockQuantity: number,
    categoryId: string,
    sellerId: string,
    images: string[] = [],
    variantTypes?: any[],
    variantOptions?: Record<string, any>
  ): Promise<Product> {
    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Verify seller exists
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new Error("Seller not found");
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stockQuantity,
        categoryId,
        createdBy: sellerId,
        images,
        variantTypes: variantTypes || [],
        variantOptions: variantOptions || {},
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return product;
  }

  /**
   * Update a product (Sellers)
   */
  static async updateProduct(
    productId: string,
    userContext: { userId: string; sellerId: string },
    updateData: {
      name?: string;
      description?: string;
      price?: number;
      stockQuantity?: number;
      images?: string[];
      variantTypes?: any[];
      variantOptions?: Record<string, any>;
    }
  ): Promise<Product> {
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

    // Allow all sellers to update any product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return updatedProduct;
  }

  /**
   * Delete a product (Seller or Admin)
   */
  static async deleteProduct(productId: string, userContext: { userId: string; role: string; sellerId?: string }) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Allow all sellers and admins to delete any product
    await prisma.product.update({
      where: { id: productId },
      data: { is_deleted: true },
    });

    return { message: "Product deleted successfully" };
  }

  /**
   * Get products by seller ID
   */
  static async getProductsBySeller(
    sellerId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{
    products: Product[];
    pagination: {
      total: number;
      skip: number;
      take: number;
      pages: number;
    };
  }> {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          createdBy: sellerId,
          is_deleted: false,
        },
        skip,
        take,
        include: {
          category: true,
          productVariants: true,
          promotions: true,
        },
      }),
      prisma.product.count({ where: { createdBy: sellerId, is_deleted: false } }),
    ]);

    return {
      products,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(
    categoryId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{
    products: Product[];
    pagination: {
      total: number;
      skip: number;
      take: number;
      pages: number;
    };
  }> {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          categoryId,
          is_deleted: false,
        },
        skip,
        take,
        include: {
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
          productVariants: true,
          promotions: true,
        },
      }),
      prisma.product.count({ where: { categoryId, is_deleted: false } }),
    ]);

    return {
      products,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get reviews for a product
   */
  static async getProductReview(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productVariants: {
          include: {
            orderItems: {
              include: {
                review: {
                  include: {
                    customer: {
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
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const reviews = product.productVariants
      .flatMap((variant) => variant.orderItems)
      .map((orderItem) => orderItem.review)
      .filter((review) => review !== null);

    return {
      productId: product.id,
      productName: product.name,
      totalReviews: reviews.length,
      reviews,
    };
  }
}
