import { z } from "zod";

export const create = z.object({
  addressId: z.cuid(),
});

export const createDirect = z.object({
  addressId: z.cuid(),
  productVariantId: z.cuid(),
  quantity: z.number().int().positive(),
});

export const update = z.object({
  status: z.enum(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export default {
  create,
  createDirect,
  update,
};
