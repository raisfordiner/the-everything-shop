import { z } from "zod";

export const MailSchema = z.object({
  from: z.email("Invalid from email address"),
  to: z.email("Invalid to email address"),
  subject: z.string().min(1, "Subject is required"),
  text: z.string().optional(),
  html: z.string().optional(),
});

