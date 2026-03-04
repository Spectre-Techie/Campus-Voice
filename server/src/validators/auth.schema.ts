import { z } from 'zod';

// ─── Login Schema ────────────────────────────────────────
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(50, 'Username must be 50 characters or fewer')
    .trim(),
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password must be 128 characters or fewer'),
});

export type LoginInput = z.infer<typeof loginSchema>;
