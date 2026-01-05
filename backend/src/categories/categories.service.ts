import { prisma } from "util/db";
import { Prisma, Category } from "@prisma/client";
import UploadService from "../upload/upload.service";

export default class CategoryService {
  /**
   * Get all categories with optional filtering and pagination
   */
  static async getAllCategories(
    skip: number = 0,
    take: number = 10,
    searchTerm?: string
  ): Promise<{
    categories: Category[];
    pagination: {
      total: number;
      skip: number;
      take: number;
      pages: number;
    };
  }> {
    const where: Prisma.CategoryWhereInput = {};

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take,
        include: {
          products: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          promotions: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.category.count({ where }),
    ]);

    return {
      categories,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get a single category by ID
   */
  static async getCategoryById(categoryId: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        promotions: {
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  /**
   * Create a new category (Admin or Seller only)
   */
  static async createCategory(
    name: string,
    description?: string,
    image?: string
  ): Promise<Category> {
    // Check if category with this name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        image: image || null,
      } as any,
    });

    return category;
  }

  /**
   * Update a category (Admin or Seller only)
   */
  static async updateCategory(
    categoryId: string,
    updateData: {
      name?: string;
      description?: string;
      image?: string;
    }
  ): Promise<Category> {
    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // If updating name, check for duplicates
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await prisma.category.findUnique({
        where: { name: updateData.name },
      });

      if (existingCategory) {
        throw new Error("A category with this name already exists");
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData as any, // Cast to any because prisma types might be stale
    });

    return updatedCategory;
  }

  /**
   * Delete a category (Admin or Seller only)
   */
  static async deleteCategory(
    categoryId: string,
    force: boolean = false
  ): Promise<{ message: string }> {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          select: { id: true },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Check if category has products
    if (category.products.length > 0 && !force) {
      throw new Error(
        "Cannot delete category with existing products. Please move or delete products first."
      );
    }

    await prisma.$transaction(async (tx) => {
      if (force && category.products.length > 0) {
        // Fetch products to get their images for cleanup
        const productsToDelete = await tx.product.findMany({
          where: { categoryId: categoryId },
          select: { images: true, id: true }
        });

        // Delete all products in this category physically
        await tx.product.deleteMany({
          where: { categoryId: categoryId },
        });

        // Clean up images from storage after DB deletion is successful
        const uploadService = new UploadService();
        for (const product of productsToDelete) {
          if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
              try {
                await uploadService.delete(imageUrl);
              } catch (error) {
                console.error(`Failed to delete product image from storage: ${imageUrl}`, error);
              }
            }
          }
        }
      }

      await tx.category.delete({
        where: { id: categoryId },
      });
    });

    const uploadService = new UploadService();

    // Clean up image from storage
    if ((category as any).image) {
      try {
        await uploadService.delete((category as any).image);
      } catch (error) {
        // Log error but don't fail the deletion process
        console.error("Failed to delete category image from storage:", error);
      }
    }

    return { message: "Category deleted successfully" };
  }

  /**
   * Get category by name
   */
  static async getCategoryByName(name: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { name },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return category;
  }

  static async getAllCategoriesSimple(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      } as any,
      orderBy: {
        name: "asc",
      },
    });

    return categories as any;
  }
}
