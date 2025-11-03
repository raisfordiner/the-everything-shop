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
          createdAt: true,
          updatedAt: true,
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
