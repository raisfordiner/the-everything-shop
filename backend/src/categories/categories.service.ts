import { prisma } from "util/db";
import { Prisma, Category } from "@prisma/client";

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
   * Create a new category (Admin only)
   */
  static async createCategory(
    name: string,
    description?: string
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
      },
    });

    return category;
  }

  /**
   * Update a category (Admin only)
   */
  static async updateCategory(
    categoryId: string,
    updateData: {
      name?: string;
      description?: string;
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
      data: updateData,
    });

    return updatedCategory;
  }

  /**
   * Delete a category (Admin only)
   */
  static async deleteCategory(categoryId: string): Promise<{ message: string }> {
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
    if (category.products.length > 0) {
      throw new Error(
        "Cannot delete category with existing products. Please move or delete products first."
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

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

  /**
   * Get all categories (without pagination - for dropdown/select)
   */
  static async getAllCategoriesSimple(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  }
}
