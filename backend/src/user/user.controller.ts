import Send from "util/response";
import { prisma } from "util/db";
import { Request, Response } from "express";
import { send } from "process";

export default class UserController {
  /**
   * Get the user information based on the authenticated user.
   * The userId is passed from the AuthMiddleware.
   */
  static getUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId; // Extract userId from the authenticated request

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
      console.error("Error fetching user info:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };
}
