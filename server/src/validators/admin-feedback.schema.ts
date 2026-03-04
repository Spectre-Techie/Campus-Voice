import { z } from 'zod';

// ─── Enum values (must match schema.prisma) ──────────────
const CATEGORIES = [
  'Academics',
  'Facilities',
  'Welfare',
  'Security',
  'IT_Services',
  'Others',
] as const;

const ALL_STATUSES = [
  'submitted',
  'under_review',
  'in_progress',
  'resolved',
  'closed',
  'spam',
] as const;

const SORT_OPTIONS = [
  'newest',
  'oldest',
  'most_upvoted',
  'priority',
] as const;

const DEPARTMENTS = [
  'Academics',
  'Facilities',
  'Welfare',
  'Security',
  'IT Services',
] as const;

// ─── Admin: List Feedback Query ──────────────────────────
export const adminListFeedbackSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(ALL_STATUSES).optional(),
  sort: z.enum(SORT_OPTIONS).default('priority'),
  search: z
    .string()
    .trim()
    .min(2, 'Search query must be at least 2 characters')
    .max(100)
    .optional(),
  department: z.string().trim().optional(),
  is_spam: z
    .string()
    .transform((v) => v === 'true')
    .pipe(z.boolean())
    .optional(),
});

export type AdminListFeedbackInput = z.infer<typeof adminListFeedbackSchema>;

// ─── Admin: Update Status ────────────────────────────────
export const updateStatusSchema = z.object({
  status: z.enum(ALL_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${ALL_STATUSES.join(', ')}` }),
  }),
  comment: z
    .string()
    .trim()
    .min(5, 'Comment must be at least 5 characters')
    .max(500, 'Comment must not exceed 500 characters'),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

// ─── Admin: Assign Department ────────────────────────────
export const assignDepartmentSchema = z.object({
  department: z.enum(DEPARTMENTS, {
    errorMap: () => ({ message: `Department must be one of: ${DEPARTMENTS.join(', ')}` }),
  }),
});

export type AssignDepartmentInput = z.infer<typeof assignDepartmentSchema>;

// ─── Admin: Spam Toggle ──────────────────────────────────
export const spamToggleSchema = z.object({
  spam: z.boolean({ required_error: 'spam field is required (true or false)' }),
});

export type SpamToggleInput = z.infer<typeof spamToggleSchema>;

// ─── UUID param validation ───────────────────────────────
export const feedbackIdParamSchema = z.object({
  id: z.string().uuid('Invalid feedback ID format'),
});
