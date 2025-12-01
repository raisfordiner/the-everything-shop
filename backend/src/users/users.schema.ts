import { z } from "zod";
import { usernameSchema, passwordSchema } from "auth/auth.schema";

const roleSchema = z.enum(["CUSTOMER", "SELLER", "ADMIN"], "Invalid role");

const create = z.object({
  username: usernameSchema,
  email: z.email("Invalid email format"),
  password: passwordSchema,
  role: roleSchema,
});

const update = z.object({
  username: usernameSchema.optional(),
  email: z.email("Invalid email format").optional(),
  password: passwordSchema.optional(),
  role: roleSchema.optional(),
});

const search = z.object({
  q: z.string().optional(),
  role: roleSchema.optional(),
});

const UsersSchema = { create, update, search };

export default UsersSchema;
