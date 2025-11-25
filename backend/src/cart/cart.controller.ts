import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import CartService from "./cart.service";

export default class CartController {
  static async getCarts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { customerID } = req.query;

      const result = await CartService.find(id, customerID as string);

      if (!result) {
        return Send.notFound(res, {}, "Cart not found");
      }

      return Send.success(res, { carts: result });
    } catch (error) {
      logger.error({ error }, "Error fetching carts");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createCart(req: Request, res: Response) {
    try {
      const { customerId } = req.body;

      const cart = await CartService.create({
        customerId,
      });

      return Send.success(res, { cart }, "Cart created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating cart");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async deleteCart(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await CartService.delete(id);

      return Send.success(res, {}, "Cart deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting cart");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async addCartItem(req: Request, res: Response) {
    try {
      const { cartId } = req.params;
      const { productVariantId, quantity } = req.body;
      const { id: customerId } = (req as any).user;

      const cartItem = await CartService.addCartItem({
        cartId,
        customerId,
        productVariantId,
        quantity,
      });

      return Send.success(res, { cartItem }, "Item added to cart successfully");
    } catch (error: any) {
      logger.error({ error }, "Error adding item to cart");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async getCartItem(req: Request, res: Response) {
    try {
      const { itemId } = req.params;

      const cartItem = await CartService.getCartItem(itemId);

      if (!cartItem) {
        return Send.notFound(res, {}, "Cart item not found");
      }

      return Send.success(res, { cartItem });
    } catch (error) {
      logger.error({ error }, "Error fetching cart item");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async updateCartItem(req: Request, res: Response) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      const cartItem = await CartService.updateCartItem(itemId, quantity);

      if (!cartItem) {
        return Send.notFound(res, {}, "Cart item not found");
      }

      return Send.success(res, { cartItem }, "Cart item updated successfully");
    } catch (error) {
      logger.error({ error }, "Error updating cart item");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async deleteCartItem(req: Request, res: Response) {
    try {
      const { itemId } = req.params;

      await CartService.deleteCartItem(itemId);

      return Send.success(res, {}, "Item removed from cart successfully");
    } catch (error) {
      logger.error({ error }, "Error removing item from cart");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
