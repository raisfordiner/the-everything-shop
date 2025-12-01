import { z } from "zod";

const clearanceLevelSchema = z.enum(["HIGH", "MEDIUM", "LOW"], "Invalid clearance level");

const create = z.object({
  promotionId: z.string().min(1, "Promotion ID is required"),
  clearanceLevel: clearanceLevelSchema,
});

const update = z.object({
  clearanceLevel: clearanceLevelSchema.optional(),
});

const search = z.object({
  promotionId: z.string().optional(),
  clearanceLevel: clearanceLevelSchema.optional(),
});

const EventsSchema = { create, update, search };

export default EventsSchema;
