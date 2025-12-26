import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import AddressService from "./address.service";
import { prisma } from "util/db";

export default class AddressController {
  private static async getCustomerId(userId: string): Promise<string | null> {
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });
    return customer?.id || null;
  }

  static async getAddresses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const customerId = await AddressController.getCustomerId(userId);
      if (!customerId) return Send.notFound(res, {}, "Customer profile not found");

      if (id) {
        const address = await AddressService.getById(id);
        if (!address) {
          return Send.notFound(res, {}, "Address not found");
        }
        // Optional: Check ownership
        if (address.customerId !== customerId) {
          return Send.forbidden(res, {}, "You are not allowed to view this address");
        }
        return Send.success(res, { address });
      }

      const filters = {
        customerId,
        phoneNumber: req.query.phoneNumber as string,
        address: req.query.address as string,
        street: req.query.street as string,
        ward: req.query.ward as string,
        district: req.query.district as string,
        province: req.query.province as string
      };

      const result = await AddressService.getAll(filters);

      return Send.success(res, { addresses: result });
    } catch (error) {
      logger.error({ error }, "Error fetching addresses");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createAddress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const customerId = await AddressController.getCustomerId(userId);
      if (!customerId) return Send.notFound(res, {}, "Customer profile not found");

      const { phoneNumber, address, street, ward, district, province } = req.body;

      const newAddress = await AddressService.create({
        customerId,
        phoneNumber,
        address,
        street,
        ward,
        district,
        province,
      });

      return Send.success(res, { address: newAddress }, "Address created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating address");
      if (error.message === "Customer not found") {
        return Send.notFound(res, {}, "Customer not found");
      }
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async updateAddress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const customerId = await AddressController.getCustomerId(userId);
      if (!customerId) return Send.notFound(res, {}, "Customer profile not found");

      // Check ownership
      const existingAddress = await AddressService.getById(id);
      if (!existingAddress) {
        return Send.notFound(res, {}, "Address not found");
      }
      if (existingAddress.customerId !== customerId) {
        return Send.forbidden(res, {}, "You are not allowed to update this address");
      }

      const { phoneNumber, address, street, ward, district, province } = req.body;

      const updatedAddress = await AddressService.update(id, {
        phoneNumber,
        address,
        street,
        ward,
        district,
        province,
      });

      return Send.success(res, { address: updatedAddress }, "Address updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating address");
      if (error.message === "Address not found") {
        return Send.notFound(res, {}, "Address not found");
      }
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async deleteAddress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const customerId = await AddressController.getCustomerId(userId);
      if (!customerId) return Send.notFound(res, {}, "Customer profile not found");

      // Check ownership
      const existingAddress = await AddressService.getById(id);
      if (!existingAddress) {
        return Send.notFound(res, {}, "Address not found");
      }
      if (existingAddress.customerId !== customerId) {
        return Send.forbidden(res, {}, "You are not allowed to delete this address");
      }

      await AddressService.delete(id);

      return Send.success(res, {}, "Address deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting address");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
