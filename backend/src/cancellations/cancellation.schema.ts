import { z } from "zod";

const statusSchema = z.enum(["REQUESTED", "APPROVED", "REJECTED", "COMPLETED"], "Invalid status");

const create = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
});

const update = z.object({
  reason: z.string().min(3, "Reason must be at least 3 characters").optional(),
  status: statusSchema.optional(),
});

const search = z.object({
  q: z.string().optional(),
  orderId: z.string().optional(),
  status: statusSchema.optional(),
});

const CancellationSchema = { create, update, search };

export default CancellationSchema;
