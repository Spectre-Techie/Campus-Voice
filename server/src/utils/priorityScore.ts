import { FeedbackCategory } from '@prisma/client';

/**
 * Category priority weights — higher = more urgent.
 * Security issues get highest base weight.
 */
const CATEGORY_WEIGHTS: Record<FeedbackCategory, number> = {
  Security: 10,
  Welfare: 8,
  Facilities: 6,
  Academics: 5,
  IT_Services: 4,
  Others: 2,
};

/**
 * Compute a priority score for sorting/triaging feedback.
 *
 * Formula: (upvotes × 0.4) + (categoryWeight × 5) + (ageDays × 0.3)
 *
 * - Upvotes: community signal    (40% influence)
 * - Category: severity weight    (base importance)
 * - Age: older unresolved = more urgent (caps at 30 days)
 */
export function computePriorityScore(
  upvoteCount: number,
  category: FeedbackCategory,
  createdAt: Date
): number {
  const weight = CATEGORY_WEIGHTS[category] ?? 2;
  const ageDays = Math.min(
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    30
  );

  const score = upvoteCount * 0.4 + weight * 5 + ageDays * 0.3;
  return Math.round(score * 100) / 100;
}
