import { z } from "zod";

const create = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
  orderItemId: z.string(),
  customerId: z.string(),
});

const update = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
});

const search = z.object({
  q: z.string().optional(),
  customerId: z.string().optional(),
  minRating: z.number().int().min(1).max(5).optional(),
  maxRating: z.number().int().min(1).max(5).optional(),
});

const ReviewsSchema = { create, update, search };

export default ReviewsSchema;
