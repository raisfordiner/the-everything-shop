import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import UsersService from "./users.service";
import UsersSchema from "./users.schema";

export default class UsersController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UsersService.findAll();

      if (!users) {
        return Send.notFound(res, {}, "Users not found");
      }

      return Send.success(res, { users });
    } catch (error) {
      logger.error({ error }, "Error fetching users info");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async searchUsers(req: Request, res: Response) {
    try {
      const { q, role } = req.query;

      const users = await UsersService.search(q as string, role as string);

      if (!users) {
        return Send.notFound(res, {}, "Can't find users with specified search");
      }

      return Send.success(res, { users });
    } catch (error) {
      logger.error({ error }, "Error fetching users info");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await UsersService.findById(id);

      if (!user) {
        return Send.notFound(res, {}, "User not found");
      }

      return Send.success(res, { user });
    } catch (error) {
      logger.error({ error }, "Error fetching user by id");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;

      const user = await UsersService.create({
        username,
        email,
        password,
        role,
      });

      return Send.success(res, { user }, "User created successfully");
    } catch (error: any) {
      if (error.code === "P2002") {
        // P2002 Prisma error code: unique constraint violation
        return Send.error(res, {}, "Email already exists");
      }

      logger.error({ error }, "Error creating user");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;

      const user = await UsersService.update(id, {
        username,
        email,
        role,
      });

      return Send.success(res, { user }, "User updated successfully");
    } catch (error: any) {
      if (error.code === "P2002") {
        // P2002 Prisma error code: unique constraint violation
        return Send.error(res, {}, "Email already exists");
      }

      logger.error({ error }, "Error updating user");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await UsersService.delete(id);

      return Send.success(res, {}, "User deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting user");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
