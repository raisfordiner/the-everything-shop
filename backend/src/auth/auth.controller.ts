import Send from "util/response.utils";
import { prisma } from "db";
import { Request, Response } from "express";
import authSchema from "validation/auth.schema";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import authConfig from "config/auth.config";

export default class AuthController {
  static login = async (req: Request, res: Response) => {
    // Destructure the request body into the expected fields
    const { email, password } = req.body as z.infer<typeof authSchema.login>;

    try {
      // 1. Check if the email already exists in the database
      const user = await prisma.user.findUnique({
        where: { email },
      });
      // If user does not exist, return an error
      if (!user) {
        return Send.error(res, null, "Invalid credentials");
      }

      // 2. Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return Send.error(res, null, "Invalid credentials.");
      }

      // 3. Generate an access token (JWT) with a short expiration time (e.g., 15 minutes)
      const accessToken = jwt.sign(
        { userId: user.id },
        authConfig.secret, // Use the secret from the authConfig for signing the access token
        { expiresIn: authConfig.secret_expires_in as any } // Use the expiration time from the config (e.g., "15m")
      );

      // 4. Generate a refresh token with a longer expiration time (e.g., 7 days)
      const refreshToken = jwt.sign(
        { userId: user.id },
        authConfig.refresh_secret, // Use the separate secret for signing the refresh token
        { expiresIn: authConfig.refresh_secret_expires_in as any } // Use the expiration time for the refresh token (e.g., "24h")
      );

      // 5. Store the refresh token in the database (optional)
      await prisma.user.update({
        where: { email },
        data: { refreshToken },
      });

      // 6. Set the access token and refresh token in HttpOnly cookies
      // This ensures that the tokens are not accessible via JavaScript and are sent automatically with each request
      // The access token expires quickly and is used for authenticating API requests
      // The refresh token is stored to allow renewing the access token when it expires

      res.cookie("accessToken", accessToken, {
        httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
        secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS-only cookies
        maxAge: 15 * 60 * 1000, // 15 minutes in mileseconds
        sameSite: "strict", // Ensures the cookie is sent only with requests from the same site
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours is mileseconds
        sameSite: "strict",
      });

      // 7. Return a successful response with the user's basic information (without sending tokens in the response body)
      return Send.success(res, {
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      // If any error occurs, return a generic error response
      console.error("Login Failed:", error); // Log the error for debugging
      return Send.error(res, null, "Login failed.");
    }
  };
}
