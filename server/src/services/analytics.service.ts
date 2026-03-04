import prisma, { withRetry } from '../config/database';
import { Prisma } from '@prisma/client';

// ─── Types ───────────────────────────────────────────────
interface AnalyticsResult {
  summary: {
    total_submissions: number;
    total_resolved: number;
    resolution_rate: number;          // percentage
    average_resolution_days: number;
    pending_over_7_days: number;
    total_in_progress: number;
    total_under_review: number;
  };
  category_breakdown: Array<{
    category: string;
    count: number;
    resolved: number;
    resolution_rate: number;
  }>;
  top_unresolved: Array<{
    id: string;
    tracking_id: string;
    title: string;
    category: string;
    status: string;
    upvote_count: number;
    priority_score: number;
    days_open: number;
    created_at: Date;
  }>;
  status_distribution: Array<{
    status: string;
    count: number;
  }>;
}

// ─── Get Admin Analytics ─────────────────────────────────
export async function getAnalytics(
  adminRole: string,
  adminDepartment: string | null,
): Promise<AnalyticsResult> {
  return withRetry(async () => {
    // Department scoping for dept admins
    const deptFilter: Prisma.FeedbackWhereInput =
      adminRole === 'department_admin' && adminDepartment
        ? { assigned_department: adminDepartment }
        : {};

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // ── Run all independent queries in parallel ──────────
    const [
      totalSubmissions,
      totalResolved,
      resolvedFeedback,
      pendingOver7Days,
      totalInProgress,
      totalUnderReview,
      categoryGroups,
      topUnresolved,
      statusGroups,
    ] = await Promise.all([
      prisma.feedback.count({
        where: { ...deptFilter, status: { not: 'spam' } },
      }),
      prisma.feedback.count({
        where: { ...deptFilter, status: 'resolved' },
      }),
      prisma.feedback.findMany({
        where: {
          ...deptFilter,
          status: 'resolved',
          resolved_at: { not: null },
        },
        select: { created_at: true, resolved_at: true },
      }),
      prisma.feedback.count({
        where: {
          ...deptFilter,
          status: { in: ['submitted', 'under_review'] },
          created_at: { lt: sevenDaysAgo },
        },
      }),
      prisma.feedback.count({
        where: { ...deptFilter, status: 'in_progress' },
      }),
      prisma.feedback.count({
        where: { ...deptFilter, status: 'under_review' },
      }),
      prisma.feedback.groupBy({
        by: ['category'],
        where: { ...deptFilter, status: { not: 'spam' } },
        _count: { id: true },
      }),
      prisma.feedback.findMany({
        where: {
          ...deptFilter,
          status: { in: ['submitted', 'under_review', 'in_progress'] },
        },
        orderBy: { priority_score: 'desc' },
        take: 5,
        select: {
          id: true,
          tracking_id: true,
          title: true,
          category: true,
          status: true,
          upvote_count: true,
          priority_score: true,
          created_at: true,
        },
      }),
      prisma.feedback.groupBy({
        by: ['status'],
        where: deptFilter,
        _count: { id: true },
      }),
    ]);

    // ── Derived summary stats ─────────────
    const resolutionRate =
      totalSubmissions > 0
        ? Math.round((totalResolved / totalSubmissions) * 100 * 10) / 10
        : 0;

    let averageResolutionDays = 0;
    if (resolvedFeedback.length > 0) {
      const totalDays = resolvedFeedback.reduce(
        (sum: number, fb: (typeof resolvedFeedback)[number]) => {
          const diff = fb.resolved_at!.getTime() - fb.created_at.getTime();
          return sum + diff / (1000 * 60 * 60 * 24);
        },
        0,
      );
      averageResolutionDays =
        Math.round((totalDays / resolvedFeedback.length) * 10) / 10;
    }

    // ── Category Breakdown (resolve counts in parallel) ──
    const categoryBreakdown = await Promise.all(
      categoryGroups.map(async (group) => {
        const resolved = await prisma.feedback.count({
          where: { ...deptFilter, category: group.category, status: 'resolved' },
        });
        const count = group._count.id;
        return {
          category: group.category,
          count,
          resolved,
          resolution_rate:
            count > 0 ? Math.round((resolved / count) * 100 * 10) / 10 : 0,
        };
      }),
    );
    categoryBreakdown.sort((a, b) => b.count - a.count);

    // ── Top 5 Unresolved (with age) ──────────
    const topUnresolvedWithAge = topUnresolved.map((fb) => ({
      ...fb,
      days_open: Math.floor(
        (Date.now() - fb.created_at.getTime()) / (1000 * 60 * 60 * 24),
      ),
    }));

    // ── Status Distribution ───────────────
    const statusDistribution = statusGroups
      .map((g) => ({
        status: g.status,
        count: g._count.id,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      summary: {
        total_submissions: totalSubmissions,
        total_resolved: totalResolved,
        resolution_rate: resolutionRate,
        average_resolution_days: averageResolutionDays,
        pending_over_7_days: pendingOver7Days,
        total_in_progress: totalInProgress,
        total_under_review: totalUnderReview,
      },
      category_breakdown: categoryBreakdown,
      top_unresolved: topUnresolvedWithAge,
      status_distribution: statusDistribution,
    };
  });
}
