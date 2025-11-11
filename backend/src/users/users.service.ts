import { prisma } from "util/db";
import { hashPassword } from "util/hash";
import { UserRole } from "@prisma/client";

export default class UsersService {
  static async find(id?: string, q?: string, role?: string) {
    if (id) {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });
    }

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
        role: true,
      },
    });
  }

  static async create(data: { username: string; email: string; password: string; role: UserRole }) {
    const check_for_email = await prisma.user.findUnique({ where: { email: data.email } });
    if (check_for_email) {
      throw new Error("Email is already in use");
    }

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: await hashPassword(data.password),
        role: data.role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (data.role === UserRole.CUSTOMER) {
      await prisma.customer.create({
        data: {
          userId: user.id,
        },
      });
    }

    if (data.role === UserRole.SELLER) {
      await prisma.seller.create({
        data: {
          userId: user.id,
        },
      });
    }

    return user;
  }

  static async update(
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    }
  ) {
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error("Email is already in use");
      }
    }

    const updateData = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
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
