import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import MembershipService from "./membership.service";
import { MembershipStatus } from "@prisma/client";

export default class MembershipController {
  static async getMemberships(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q, customerId, membership } = req.query;

      const result = await MembershipService.find(
        id,
        q as string,
        customerId as string,
        membership as MembershipStatus
      );

      if (!result) {
        return Send.notFound(res, {}, id ? "Membership not found" : "Memberships not found");
      }

      const response = id ? { membership: result } : { memberships: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching memberships");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createMembership(req: Request, res: Response) {
    try {
      const { customerId, membership, spent } = req.body;

      const membershipRecord = await MembershipService.create({
        customerId,
        membership,
        spent,
      });

      return Send.success(res, { membership: membershipRecord }, "Membership created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating membership");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateMembership(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { customerId, membership, spent } = req.body;

      const membershipRecord = await MembershipService.update(id, {
        customerId,
        membership,
        spent,
      });

      return Send.success(res, { membership: membershipRecord }, "Membership updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating membership");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteMembership(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await MembershipService.delete(id);

      return Send.success(res, {}, "Membership deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting membership");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
