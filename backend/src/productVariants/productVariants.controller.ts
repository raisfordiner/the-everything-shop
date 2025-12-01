import { Request, Response } from "express";
import Send from "util/response";
import ProductVariantService from "./productVariants.service";
import ProductVariantSchema, {
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  GetAllProductVariantsQuery,
} from "./productVariants.schema";
import { logger } from "util/logger";
import { prisma } from "util/db";
import jwt from "jsonwebtoken";
import authConfig from "config/auth.config";

export default class ProductVariantController {
  /**
   * Helper function to extract userId and role from JWT token
   */
  private static getTokenData(req: Request): { userId: string; role: string } {
    const token = req.cookies.accessToken;
    const decodedToken = jwt.verify(token, authConfig.secret) as { userId: string; role: string };
    return { userId: decodedToken.userId, role: decodedToken.role };
  }

  /**
   * Get all product variants with optional filtering and pagination
   * GET /product-variants?skip=0&take=10&productId=xxx
   */
  static async getAllProductVariants(req: Request, res: Response) {
    try {
      const queryValidation = ProductVariantSchema.getAllProductVariantsQuery.safeParse(req.query);

      if (!queryValidation.success) {
        const errors = queryValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { skip, take, productId, search } = queryValidation.data as GetAllProductVariantsQuery;

      const result = await ProductVariantService.getAllProductVariants(skip, take, productId, search);

      return Send.success(res, result, "Product variants fetched successfully");
    } catch (error) {
      logger.error({ error }, "Failed to fetch product variants");
      return Send.error(res, null, "Failed to fetch product variants");
    }
  }

  /**
   * Get a single product variant by ID
   * GET /product-variants/:id
   */
  static async getProductVariantById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const productVariant = await ProductVariantService.getProductVariantById(id);

      return Send.success(res, productVariant, "Product variant fetched successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to fetch product variant");

      if (error.message === "Product variant not found") {
        return Send.notFound(res, null, "Product variant not found");
      }

      return Send.error(res, null, "Failed to fetch product variant");
    }
  }

  /**
   * Create a new product variant (Seller only)
   * POST /product-variants
   */
  static async createProductVariant(req: Request, res: Response) {
    try {
      const bodyValidation = ProductVariantSchema.createProductVariant.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const { productId, quantity, variantAttributes, images, priceAdjustment } =
        bodyValidation.data as CreateProductVariantRequest;

      // Get userId from token (already validated by sellerGuard middleware)
      const { userId } = ProductVariantController.getTokenData(req);

      // Get seller profile for the user
      const seller = await prisma.seller.findUnique({
        where: { userId },
      });

      if (!seller) {
        return Send.forbidden(res, null, "Seller profile not found");
      }

      // Verify that the seller owns the product
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return Send.notFound(res, null, "Product not found");
      }

      if (product.createdBy !== seller.id) {
        return Send.forbidden(res, null, "You can only create variants for your own products");
      }

      const productVariant = await ProductVariantService.createProductVariant(
        productId,
        quantity,
        variantAttributes,
        images,
        priceAdjustment
      );

      return Send.success(res, productVariant, "Product variant created successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to create product variant");

      if (error.message.includes("not found")) {
        return Send.notFound(res, null, error.message);
      }

      return Send.error(res, null, "Failed to create product variant");
    }
  }

  /**
   * Update a product variant (Seller only)
   * PUT /product-variants/:id
   */
  static async updateProductVariant(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bodyValidation = ProductVariantSchema.updateProductVariant.safeParse(req.body);

      if (!bodyValidation.success) {
        const errors = bodyValidation.error.flatten().fieldErrors;
        return Send.validationErrors(res, errors);
      }

      const updateData = bodyValidation.data as UpdateProductVariantRequest;

      // Get userId and role from token (already validated by adminOrSellerGuard middleware)
      const { userId, role } = ProductVariantController.getTokenData(req);

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

      const productVariant = await ProductVariantService.updateProductVariant(
        id,
        { userId, role, sellerId },
        updateData
      );

      return Send.success(res, productVariant, "Product variant updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to update product variant");

      if (error.message === "Product variant not found") {
        return Send.notFound(res, null, "Product variant not found");
      }

      if (error.message.includes("not authorized")) {
        return Send.forbidden(res, null, error.message);
      }

      return Send.error(res, null, "Failed to update product variant");
    }
  }

  /**
   * Delete a product variant (Seller & Admin)
   * DELETE /product-variants/:id
   */
  static async deleteProductVariant(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get userId and role from token (already validated by adminOrSellerGuard middleware)
      const { userId, role } = ProductVariantController.getTokenData(req);

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

      const result = await ProductVariantService.deleteProductVariant(id, { userId, role, sellerId });

      return Send.success(res, result, "Product variant deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to delete product variant");

      if (error.message === "Product variant not found") {
        return Send.notFound(res, null, "Product variant not found");
      }

      if (error.message.includes("not authorized")) {
        return Send.forbidden(res, null, error.message);
      }

      return Send.error(res, null, "Failed to delete product variant");
    }
  }

  /**
   * Get product variants by product ID
   * GET /product-variants/product/:productId
   */
  static async getProductVariantsByProductId(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { skip = 0, take = 10 } = req.query;

      const result = await ProductVariantService.getProductVariantsByProductId(
        productId,
        parseInt(skip as string) || 0,
        parseInt(take as string) || 10
      );

      return Send.success(res, result, "Product variants fetched successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to fetch product variants");

      if (error.message === "Product not found") {
        return Send.notFound(res, null, "Product not found");
      }

      return Send.error(res, null, "Failed to fetch product variants");
    }
  }

  /**
   * Update product variant quantity
   * PATCH /product-variants/:id/quantity
   */
  static async updateQuantity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== "number" || quantity < 0) {
        return Send.badRequest(res, null, "Quantity must be a non-negative number");
      }

      // Get userId and role from token (already validated by adminOrSellerGuard middleware)
      const { userId, role } = ProductVariantController.getTokenData(req);

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

      // Verify authorization
      if (role === "SELLER") {
        const productVariant = await prisma.productVariant.findUnique({
          where: { id },
          include: {
            product: true,
          },
        });

        if (!productVariant) {
          return Send.notFound(res, null, "Product variant not found");
        }

        const product = productVariant.product;
        if (product.createdBy !== sellerId) {
          return Send.forbidden(res, null, "You are not authorized to update this product variant");
        }
      }

      const productVariant = await ProductVariantService.updateQuantity(id, quantity);

      return Send.success(res, productVariant, "Product variant quantity updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Failed to update quantity");

      if (error.message === "Product variant not found") {
        return Send.notFound(res, null, "Product variant not found");
      }

      return Send.error(res, null, "Failed to update quantity");
    }
  }
}
