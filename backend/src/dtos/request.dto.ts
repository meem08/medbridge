import { z } from 'zod';

export const CreateRequestSchema = z.object({
  bloodType: z.string(),
  units: z.number().int().positive(),
  hospitalName: z.string().min(1),
  location: z.string().min(1),
  urgency: z.enum(['critical', 'urgent', 'normal', 'routine']),
  explanation: z.string().optional(),
});

export type CreateRequestDto = z.infer<typeof CreateRequestSchema>;
