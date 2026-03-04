import { z } from 'zod';

// ─── Prisma enum values (must match schema.prisma) ──────
const CATEGORIES = [
  'Academics',
  'Facilities',
  'Welfare',
  'Security',
  'IT_Services',
  'Others',
] as const;

const PUBLIC_STATUSES = [
  'submitted',
  'under_review',
  'in_progress',
  'resolved',
  'closed',
] as const;

const SORT_OPTIONS = [
  'newest',
  'oldest',
  'most_upvoted',
  'priority',
] as const;

// ─── Submit Feedback ────────────────────────────────────
export const submitFeedbackSchema = z.object({
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(', ')}` }),
  }),
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title must not exceed 120 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(3000, 'Description must not exceed 3000 characters'),
  image_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .nullable(),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;

// ─── List Feedback (query params) ───────────────────────
export const listFeedbackSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(PUBLIC_STATUSES).optional(),
  sort: z.enum(SORT_OPTIONS).default('newest'),
  search: z
    .string()
    .trim()
    .min(2, 'Search query must be at least 2 characters')
    .max(100)
    .optional(),
});

export type ListFeedbackInput = z.infer<typeof listFeedbackSchema>;

// ─── Get Single Feedback (params) ───────────────────────
export const trackingIdParamSchema = z.object({
  trackingId: z
    .string()
    .regex(/^CV-[A-Z2-9]{8}$/, 'Invalid tracking ID format'),
});

export type TrackingIdParam = z.infer<typeof trackingIdParamSchema>;
