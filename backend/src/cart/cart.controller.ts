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
}
