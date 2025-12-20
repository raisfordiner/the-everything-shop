import { z } from "zod";
import { MembershipStatus } from "@prisma/client";

const create = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  membership: z.nativeEnum(MembershipStatus, { errorMap: () => ({ message: "Invalid membership status" }) }),
  spent: z.number().min(0, "Spent amount must be at least 0"),
});

const update = z.object({
  customerId: z.string().min(1, "Customer ID is required").optional(),
  membership: z.nativeEnum(MembershipStatus, { errorMap: () => ({ message: "Invalid membership status" }) }).optional(),
  spent: z.number().min(0, "Spent amount must be at least 0").optional(),
});

const search = z.object({
  q: z.string().optional(),
  customerId: z.string().optional(),
  membership: z.nativeEnum(MembershipStatus).optional(),
});

const MembershipSchema = { create, update, search };

export default MembershipSchema;
