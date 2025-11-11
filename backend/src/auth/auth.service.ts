import { prisma } from "util/db";
import jwt from "jsonwebtoken";
import authConfig from "config/auth.config";
import { comparePassword, hashPassword } from "util/hash";
// import { z } from "zod";
// import AuthSchema from "./auth.schema";

// const ONE_MINUTE: number = 60 * 1000; // one minute in milliseconds

export default class AuthService {
  static async register(username: string, email: string, password: string) {
    if (await prisma.user.findUnique({ where: { email } })) {
      throw new Error("Email is already in use");
    }

    const user = await prisma.$transaction(async (prisma) => {
      const createdUser = await prisma.user.create({
        data: { username, email, password: await hashPassword(password) },
      });

      await prisma.customer.create({
        data: { userId: createdUser.id },
      });

      return createdUser;
    });

    return user;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, authConfig.secret, {
      expiresIn: authConfig.secret_expires_in as any,
    });

    const refreshToken = jwt.sign({ userId: user.id, role: user.role }, authConfig.refresh_secret, {
      expiresIn: authConfig.refresh_secret_expires_in as any,
    });

    await prisma.user.update({ where: { email }, data: { refreshToken } });

    return { user, accessToken, refreshToken };
  }

  static async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }

  static async refreshToken(userId: string, refreshToken: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = jwt.sign({ userId: user.id }, authConfig.secret, {
      expiresIn: authConfig.secret_expires_in as any,
    });

    return newAccessToken;
  }
}
