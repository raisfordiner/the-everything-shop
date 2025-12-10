import { Request, Response } from "express";
import OrderService from "./order.service";
import Send from "util/response";

export default class OrderController {
  static async get(req: Request, res: Response) {
    const { id } = req.params;

    const userRole = (req as any).user?.role;
    const customerId = req.query.customerId as string | undefined;
    const status = req.query.status as string | undefined;
    const userCustomerId = (req as any).user?.customer?.id;

    try {
      // If not admin, only show own orders
      const filterCustomerId = userRole === "ADMIN" ? customerId : userCustomerId;

      const result = await OrderService.find(id, filterCustomerId, status);

      if (!result) {
        return Send.notFound(res, null, id ? "Order not found" : "Orders not found");
      }

      // Check if user owns this order (unless admin)
      if (id && userRole !== "ADMIN" && (result as any).customerId !== userCustomerId) {
        return Send.forbidden(res, null, "Unauthorized");
      }

      const response = id ? { order: result } : { orders: result };

      return Send.success(res, response);
    } catch (error: any) {
      return Send.badRequest(res, null, error.message);
    }
  }

  static async create(req: Request, res: Response) {
    const { addressId } = req.body;
    const customerId = (req as any).user?.customer?.id;

    if (!customerId) {
      return Send.notFound(res, null, "Customer not found");
    }

    try {
      const order = await OrderService.create(customerId, addressId);

      return Send.success(res, order, "Order created successfully");
    } catch (error: any) {
      return Send.badRequest(res, null, error.message);
    }
  }

  static async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const order = await OrderService.updateStatus(id, status);

      return Send.success(res, order, "Order status updated successfully");
    } catch (error: any) {
      return Send.badRequest(res, null, error.message);
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await OrderService.delete(id);

      return Send.success(res, null, "Order deleted successfully");
    } catch (error: any) {
      return Send.badRequest(res, null, error.message);
    }
  }
}
