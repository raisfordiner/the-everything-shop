import { z } from 'zod';

// Payment status enum for validation
const paymentStatusSchema = z.enum(['PENDING', 'SUCCESS', 'FAILED']);

// Schema for updating payment status
export const updatePaymentStatusSchema = z.object({
    status: paymentStatusSchema,
});

// Schema for payment ID parameter
export const paymentIdParamSchema = z.object({
    paymentId: z.string().cuid(),
});

export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
