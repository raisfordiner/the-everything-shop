import { z } from "zod";
import { ReturnStatus } from "@prisma/client";

const create = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason too long"),
});

const update = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason too long").optional(),
  status: z.nativeEnum(ReturnStatus).optional(),
});

const search = z.object({
  q: z.string().optional(),
  orderId: z.string().optional(),
  status: z.nativeEnum(ReturnStatus).optional(),
});

const ReturnSchema = { create, update, search };

export default ReturnSchema;
