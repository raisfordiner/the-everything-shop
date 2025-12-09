import Send from "util/response";
import { prisma } from "util/db";
import { Request, Response } from "express";
import { logger } from "util/logger";
import UploadService from "upload/upload.service";

/**
 * Get the user information based on the authenticated user.
 * The userId is passed from the AuthMiddleware.
 */

export default class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          customer: {
            select: {
              id: true,
              image: true,
              addresses: true,
              createdAt: true,
              updatedAt: true,
            }
          },
          seller: {
            select: {
              id: true,
              email: true,
              image: true,
              createdAt: true,
              updatedAt: true,
            }
          },
          admin: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
            }
          }
        },
      });

      if (!user) {
        return Send.notFound(res, {}, "User not found");
      }

      return Send.success(res, { user });
    } catch (error) {
      logger.error({ error }, "Error fetching user info");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { username, email } = req.body;

      if (!username && !email) {
        return Send.error(res, {}, "Username or email is required");
      }

      const updateData: any = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
        }
      });

      return Send.success(res, { user }, "User updated successfully");
    } catch (error) {
      logger.error({ error }, "Error updating user info");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async getPfp(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const customer = await prisma.customer.findUnique({
        where: { userId },
        select: { image: true }
      });

      if (!customer) {
        return Send.notFound(res, {}, "Customer not found");
      }

      return Send.success(res, { image: customer.image });
    } catch (error) {
      logger.error({ error }, "Error fetching profile picture");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async uploadPfp(req: Request, res: Response) {
    try {
      if (!(req as any).file) {
        return Send.badRequest(res, {}, "No file provided");
      }

      const userId = (req as any).user?.userId;
      const customer = await prisma.customer.findUnique({
        where: { userId }
      });

      if (!customer) {
        return Send.notFound(res, {}, "Customer not found");
      }

      const uploadService = new UploadService();

      // Delete old image if exists
      if (customer.image) {
        try {
          await uploadService.delete(customer.image);
        } catch (error) {
          logger.error({ error }, "Failed to delete old profile picture");
        }
      }

      // Upload new image
      const file = (req as any).file;
      const imageUrl = await uploadService.upload(file.originalname, file.buffer);

      // Update customer record
      const updatedCustomer = await prisma.customer.update({
        where: { id: customer.id },
        data: { image: imageUrl },
        select: { image: true }
      });

      return Send.success(res, { image: updatedCustomer.image }, "Profile picture updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error uploading profile picture");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
