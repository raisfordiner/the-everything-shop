import { prisma } from "util/db";
import jwt from "jsonwebtoken";
import authConfig from "config/auth.config";
import { comparePassword, hashPassword } from "util/hash";

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

    const emailVerificationToken = jwt.sign({ userId: user.id }, authConfig.secret, {
      expiresIn: authConfig.secret_expires_in as any,
    });

    return { user, emailVerificationToken };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists - return generic message
      return { user: null, resetPasswordToken: null };
    }

    const resetPasswordToken = jwt.sign({ userId: user.id }, authConfig.secret, {
      expiresIn: authConfig.secret_expires_in as any,
    });

    return { user, resetPasswordToken };
  }

  static async changePassword(userId: string, old_password: string, new_password: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found.");
    }

    const isPasswordValid = await comparePassword(old_password, user.password);
    if (!isPasswordValid) {
      throw new Error("Old password not matching.");
    }

    if (old_password === new_password) {
      throw new Error("New password must be different from old password.");
    }

    const hashedPassword = await hashPassword(new_password);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.logout(userId);

    return updatedUser;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    if (!user.emailVerified) {
      throw new Error("Email not verified. Please check your email for verification link.");
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

  static async verifyEmailToken(token: string) {
    try {
      const decoded = jwt.verify(token, authConfig.secret) as { userId: string };

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error("User not found.");
      }

      // Mark email as verified
      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: { emailVerified: new Date() },
      });

      return updatedUser;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Email verification token has expired.");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid email verification token.");
      }
      throw error;
    }
  }

  static async resetPasswordWithToken(token: string, new_password: string) {
    try {
      const decoded = jwt.verify(token, authConfig.secret) as { userId: string };

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error("User not found.");
      }

      const hashedPassword = await hashPassword(new_password);

      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword, emailVerified: new Date() },
      });

      // Logout user from all sessions
      await this.logout(decoded.userId);

      return updatedUser;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Password reset token has expired.");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid password reset token.");
      }
      throw error;
    }
  }
}
