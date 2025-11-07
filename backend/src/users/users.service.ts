import { prisma } from "util/db";
import { hashPassword } from "util/hash";
import { UserRole } from "@prisma/client";

export default class UsersService {
  static async findAll() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
  }

  static async search(q?: string, role?: string) {
    return await prisma.user.findMany({
      where: {
        OR: q
          ? [{ username: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }]
          : undefined,
        role: role as UserRole | undefined,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
  }

  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
  }

  static async create(data: { username: string; email: string; password?: string; role?: UserRole }) {
    const hashedPassword = data.password ? await hashPassword(data.password) : null;

    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || UserRole.CUSTOMER,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
  }

  static async update(
    id: string,
    data: {
      username?: string;
      email?: string;
      role?: UserRole;
    }
  ) {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
