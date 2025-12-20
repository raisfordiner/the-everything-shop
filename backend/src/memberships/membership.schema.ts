import { z } from "zod";
import { MembershipStatus } from "@prisma/client";

const create = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  spent: z.number().min(0, "Spent amount must be at least 0"),
});

const update = z.object({
  customerId: z.string().min(1, "Customer ID is required").optional(),
  spent: z.number().min(0, "Spent amount must be at least 0").optional(),
});

const search = z.object({
  q: z.string().optional(),
  membership: z.enum(MembershipStatus).optional(),
});

const MembershipSchema = { create, update, search };

export default MembershipSchema;
