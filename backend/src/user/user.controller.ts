import Send from "util/response";
import { prisma } from "util/db";
import { Request, Response } from "express";
import { logger } from "util/logger";

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
}
