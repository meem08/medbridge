import { z } from 'zod';

export const CreateRequestSchema = z.object({
  bloodType: z.string(),
  units: z.number().int().positive(),
  hospitalName: z.string().min(1),
  location: z.string().min(1),
  urgency: z.enum(['urgent', 'routine']),
});

export type CreateRequestDto = z.infer<typeof CreateRequestSchema>;
