import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(/[@$!%*?&]/, "Password must include at least one special character");

const usernameSchema = z
  .string()
  .min(6, "Username must be at least 6 characters long")
  .max(20, "Username must not exceed 20 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
  .refine((value) => !/^\d+$/.test(value), {
    message: "Username cannot be only numbers",
  })
  .refine((value) => !/[@$!%*?&]/.test(value), {
    message: "Username cannot contain special characters like @$!%*?&",
  });

const roleSchema = z.enum(["CUSTOMER", "SELLER", "ADMIN"], "Invalid role");

const create = z.object({
  username: usernameSchema,
  email: z.email("Invalid email format"),
  password: passwordSchema,
  role: roleSchema,
});

const update = z.object({
  username: usernameSchema,
  email: z.email("Invalid email format"),
  role: roleSchema,
});

const search = z.object({
  q: z.string(),
  role: roleSchema.optional,
});

const UsersSchema = { create, update, search };

export default UsersSchema;
