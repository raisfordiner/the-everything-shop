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
      const userId = (req as any).userId;

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
}
