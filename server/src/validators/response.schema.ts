import { z } from 'zod';

const ALL_STATUSES = [
  'submitted',
  'under_review',
  'in_progress',
  'resolved',
  'closed',
] as const;

// ─── Admin Response Schema ───────────────────────────────
export const addResponseSchema = z.object({
  response_text: z
    .string()
    .trim()
    .min(20, 'Response must be at least 20 characters')
    .max(2000, 'Response must not exceed 2000 characters'),
  proof_image_url: z
    .string()
    .url('Proof image must be a valid URL')
    .optional()
    .nullable(),
  expected_resolution: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const d = new Date(val);
        return !isNaN(d.getTime());
      },
      { message: 'Expected resolution must be a valid date' },
    )
    .refine(
      (val) => {
        if (!val) return true;
        return new Date(val) > new Date();
      },
      { message: 'Expected resolution date must be in the future' },
    )
    .transform((val) => {
      if (!val) return val;
      return new Date(val).toISOString();
    }),
  status_changed_to: z.enum(ALL_STATUSES).optional().nullable(),
});

export type AddResponseInput = z.infer<typeof addResponseSchema>;
