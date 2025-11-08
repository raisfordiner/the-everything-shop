import { Request, Response } from "express";
import Send from "util/response";
import ProductService from "./product.service";
import ProductSchema, {
  CreateProductRequest,
  UpdateProductRequest,
  GetAllProductsQuery,
} from "./product.schema";
import { logger } from "util/logger";
import { prisma } from "util/db";
import jwt from "jsonwebtoken";
import authConfig from "config/auth.config";

export default class ProductController {
  /**
   * Helper function to extract userId and role from JWT token
   */
  private static getTokenData(req: Request): { userId: string; role: string } {
    const token = req.cookies.accessToken;
    const decodedToken = jwt.verify(token, authConfig.secret) as { userId: string; role: string };
    return { userId: decodedToken.userId, role: decodedToken.role };
  }

  /**
   * Get all products with optional filtering and pagination
   * GET /products?skip=0&take=10&categoryId=xxx&search=xxx
   */
  static async getAllProducts(req: Request, res: Response) {
    try {
      const queryValidation = ProductSchema.getAllProductsQuery.safeParse(req.query);

      if (!queryValidation.success) {
        const errors = queryValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { skip, take, categoryId, search } = queryValidation.data as GetAllProductsQuery;

      const result = await ProductService.getAllProducts(skip, take, categoryId, search);

      return Send.success(res, result, "Products fetched successfully");
    } catch (error) {
      logger.error({ error }, "Failed to fetch products");
      return Send.error(res, null, "Failed to fetch products");
    }
  }

  /**
   * Get a single product by ID
   * GET /products/:id
   */
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await ProductService.getProductById(id);

      return Send.success(res, product, "Product fetched successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to fetch product");

      if (error.message === "Product not found") {
        return Send.notFound(res, null, "Product not found");
      }

      return Send.error(res, null, "Failed to fetch product");
    }
  }

  /**
   * Create a new product (Seller only)
   * POST /products
   */
  static async createProduct(req: Request, res: Response) {
    try {
      const bodyValidation = ProductSchema.createProduct.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { name, description, price, stockQuantity, categoryId, images, variantTypes, variantOptions } =
        bodyValidation.data as CreateProductRequest;

      // Get userId from token (already validated by sellerGuard middleware)
      const { userId } = ProductController.getTokenData(req);

      // Get seller profile for the user
      const seller = await prisma.seller.findUnique({
        where: { userId },
      });

      if (!seller) {
        return Send.forbidden(res, null, "Seller profile not found");
      }

      const product = await ProductService.createProduct(
        name,
        description,
        price,
        stockQuantity,
        categoryId,
        seller.id,
        images,
        variantTypes,
        variantOptions
      );

      return Send.success(res, product, "Product created successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to create product");

      if (error.message.includes("not found")) {
        return Send.badRequest(res, null, error.message);
      }

      return Send.error(res, null, "Failed to create product");
    }
  }

  /**
   * Update a product (Seller only)
   * PUT /products/:id
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = ProductSchema.updateProduct.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const updateData = bodyValidation.data as UpdateProductRequest;

      // Get userId from token (already validated by adminOrSellerGuard middleware)
      const { userId } = ProductController.getTokenData(req);

      // Get seller profile for the user (only needed if user is a seller)
      let sellerId: string | undefined;
        const seller = await prisma.seller.findUnique({
          where: { userId },
        });

        if (!seller) {
          return Send.forbidden(res, null, "Seller profile not found");
        }

        sellerId = seller.id;

      const product = await ProductService.updateProduct(id, { userId, sellerId }, updateData);

      return Send.success(res, product, "Product updated successfully");
    } catch (error: any) {
      logger.error( error.message , "Failed to update product");

      if (error.message === "Product not found") {
        return Send.notFound(res, null, "Product not found");
      }

      if (error.message.includes("not authorized")) {
        return Send.forbidden(res, null, error.message);
      }

      if (error.message.includes("not found")) {
        return Send.badRequest(res, null, error.message);
      }

      return Send.error(res, null, "Failed to update product");
    }
  }

  /**
   * Delete a product (Seller only)
   * DELETE /products/:id
   */
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get userId and role from token (already validated by adminOrSellerGuard middleware)
      const { userId, role } = ProductController.getTokenData(req);

      // Get seller profile for the user (only needed if user is a seller)
      let sellerId: string | undefined;
      if (role === "SELLER") {
        const seller = await prisma.seller.findUnique({
          where: { userId },
        });

        if (!seller) {
          return Send.forbidden(res, null, "Seller profile not found");
        }

        sellerId = seller.id;
      }

      const result = await ProductService.deleteProduct(id, { userId, role, sellerId });

      return Send.success(res, result, "Product deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to delete product");

      if (error.message === "Product not found") {
        return Send.notFound(res, null, "Product not found");
      }

      if (error.message.includes("not authorized")) {
        return Send.forbidden(res, null, error.message);
      }

      return Send.error(res, null, "Failed to delete product");
    }
  }

  /**
   * Get products by seller
   * GET /products/seller/:sellerId
   */
  static async getProductsBySeller(req: Request, res: Response) {
    try {
      const { sellerId } = req.params;
      const { skip = 0, take = 10 } = req.query;

      const result = await ProductService.getProductsBySeller(
        sellerId,
        parseInt(skip as string) || 0,
        parseInt(take as string) || 10
      );

      return Send.success(res, result, "Products fetched successfully");
    } catch (error) {
      logger.error({ error }, "Failed to fetch seller products");
      return Send.error(res, null, "Failed to fetch seller products");
    }
  }

  /**
   * Get products by category
   * GET /products/category/:categoryId
   */
  static async getProductsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const { skip = 0, take = 10 } = req.query;

      const result = await ProductService.getProductsByCategory(
        categoryId,
        parseInt(skip as string) || 0,
        parseInt(take as string) || 10
      );

      return Send.success(res, result, "Products fetched successfully");
    } catch (error) {
      logger.error({ error }, "Failed to fetch category products");
      return Send.error(res, null, "Failed to fetch category products");
    }
  }
}
