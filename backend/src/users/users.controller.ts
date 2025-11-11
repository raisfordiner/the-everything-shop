import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import UsersService from "./users.service";

export default class UsersController {
  static async getUsers(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q, role } = req.query;

      const result = await UsersService.find(id, q as string, role as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "User not found" : "Users not found");
      }

      const response = id ? { user: result } : { users: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching users");
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
      logger.error({ error }, "Error creating user");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email, password, role } = req.body;

      const user = await UsersService.update(id, {
        username,
        email,
        password,
        role,
      });

      return Send.success(res, { user }, "User updated successfully");
    } catch (error: any) {
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
