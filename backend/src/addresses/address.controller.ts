import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import AddressService from "./address.service";

export default class AddressController {
  static async getAddresses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { customerId, phoneNumber, address, street, ward, district, province } = req.query;

      const result = await AddressService.find(
        id,
        customerId as string,
        phoneNumber as string,
        address as string,
        street as string,
        ward as string,
        district as string,
        province as string
      );

      if (!result) {
        return Send.notFound(res, {}, id ? "Address not found" : "Addresses not found");
      }

      const response = id ? { address: result } : { addresses: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching addresses");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createAddress(req: Request, res: Response) {
    try {
      const { customerId, phoneNumber, address, street, ward, district, province } = req.body;

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

      await AddressService.delete(id);

      return Send.success(res, {}, "Address deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting address");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
