import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['donor', 'hospital', 'bloodbank']),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['donor', 'hospital', 'bloodbank']),
  name: z.string().min(1),
  location: z.string().optional(),
  contactNumber: z.string().optional(),
  bloodType: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export type SignUpDto = z.infer<typeof SignUpSchema>;
