import { z } from "zod";

export const create = z.object({
  addressId: z.cuid(),
});

export const update = z.object({
  status: z.enum(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export default {
  create,
  update,
};
