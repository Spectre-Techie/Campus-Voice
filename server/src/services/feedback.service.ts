import prisma, { withRetry } from '../config/database';
import { FeedbackCategory, FeedbackStatus, Prisma } from '@prisma/client';
import { generateTrackingId } from '../utils/trackingId';
import { computePriorityScore } from '../utils/priorityScore';
import { SubmitFeedbackInput, ListFeedbackInput } from '../validators/feedback.schema';
import { createError } from '../middleware/errorHandler';

// ─── Category Mapping ───────────────────────────────────
// Map category to default assigned department
const CATEGORY_DEPARTMENT: Record<string, string | null> = {
  Academics: 'Academics',
  Facilities: 'Facilities',
  Welfare: 'Welfare',
  Security: 'Security',
  IT_Services: 'IT Services',
  Others: null,
};

// ─── Submit Feedback ────────────────────────────────────
export async function createFeedback(input: SubmitFeedbackInput) {
  return withRetry(async () => {
    // Generate unique tracking ID (retry on collision)
    let trackingId: string;
    let attempts = 0;
    do {
      trackingId = generateTrackingId();
      const existing = await prisma.feedback.findUnique({
        where: { tracking_id: trackingId },
        select: { id: true },
      });
      if (!existing) break;
      attempts++;
    } while (attempts < 5);

    if (attempts >= 5) {
      throw createError('Failed to generate unique tracking ID', 500, 'TRACKING_ID_COLLISION');
    }

    const category = input.category as FeedbackCategory;
    const priorityScore = computePriorityScore(0, category, new Date());

    const feedback = await prisma.feedback.create({
      data: {
        tracking_id: trackingId,
        category,
        title: input.title,
        description: input.description,
        image_url: input.image_url ?? null,
        assigned_department: CATEGORY_DEPARTMENT[input.category] ?? null,
        priority_score: priorityScore,
        status_history: {
          create: {
            old_status: null,
            new_status: 'submitted',
            comment: 'Feedback submitted anonymously',
            changed_by: null,
          },
        },
      },
      select: {
        id: true,
        tracking_id: true,
        category: true,
        title: true,
        status: true,
        created_at: true,
      },
    });

    return feedback;
  });
}

// ─── List Feedback (Public) ─────────────────────────────
export async function listFeedback(input: ListFeedbackInput) {
  return withRetry(async () => {
    const { page, limit, category, status, sort, search } = input;
    const skip = (page - 1) * limit;

    // Build where clause — always exclude spam
    const where: Prisma.FeedbackWhereInput = {
      status: { not: 'spam' as FeedbackStatus },
    };

    if (category) {
      where.category = category as FeedbackCategory;
    }

    if (status) {
      where.status = status as FeedbackStatus;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tracking_id: { contains: search.toUpperCase(), mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    let orderBy: Prisma.FeedbackOrderByWithRelationInput;
    switch (sort) {
      case 'oldest':
        orderBy = { created_at: 'asc' };
        break;
      case 'most_upvoted':
        orderBy = { upvote_count: 'desc' };
        break;
      case 'priority':
        orderBy = { priority_score: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { created_at: 'desc' };
        break;
    }

    // Sequential queries to avoid connection pool exhaustion on free tier
    const items = await prisma.feedback.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        tracking_id: true,
        category: true,
        title: true,
        description: true,
        image_url: true,
        status: true,
        upvote_count: true,
        created_at: true,
        updated_at: true,
        resolved_at: true,
        _count: { select: { responses: true } },
      },
    });

    const total = await prisma.feedback.count({ where });

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((item: typeof items[number]) => ({
        ...item,
        response_count: item._count.responses,
        _count: undefined,
      })),
      pagination: {
        total,
        page,
        limit,
        total_pages: totalPages,
        has_next: page < totalPages,
      },
    };
  });
}

// ─── Get Single Feedback (Public) ───────────────────────
export async function getFeedbackByTrackingId(trackingId: string) {
  return withRetry(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { tracking_id: trackingId },
      include: {
        responses: {
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            response_text: true,
            status_changed_to: true,
            proof_image_url: true,
            created_at: true,
            admin: {
              select: {
                display_name: true,
                department: true,
              },
            },
          },
        },
        status_history: {
          orderBy: { changed_at: 'desc' },
          select: {
            new_status: true,
            comment: true,
            changed_at: true,
          },
        },
        _count: { select: { responses: true } },
      },
    });

    if (!feedback) {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    // Don't expose spam feedback publicly
    if (feedback.status === 'spam') {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    type ResponseItem = typeof feedback.responses[number];
    type HistoryItem = typeof feedback.status_history[number];

    return {
      id: feedback.id,
      tracking_id: feedback.tracking_id,
      category: feedback.category,
      title: feedback.title,
      description: feedback.description,
      image_url: feedback.image_url,
      status: feedback.status,
      upvote_count: feedback.upvote_count,
      assigned_department: feedback.assigned_department,
      response_count: feedback._count.responses,
      created_at: feedback.created_at,
      updated_at: feedback.updated_at,
      resolved_at: feedback.resolved_at,
      responses: feedback.responses.map((r: ResponseItem) => ({
        id: r.id,
        admin_name: r.admin.display_name,
        admin_department: r.admin.department,
        response_text: r.response_text,
        status_changed_to: r.status_changed_to,
        proof_image_url: r.proof_image_url,
        created_at: r.created_at,
      })),
      status_history: feedback.status_history.map((h: HistoryItem) => ({
        status: h.new_status,
        comment: h.comment,
        changed_at: h.changed_at,
      })),
    };
  });
}

// ─── Upvote Feedback ────────────────────────────────────
export async function upvoteFeedback(trackingId: string) {
  return withRetry(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { tracking_id: trackingId },
      select: { id: true, status: true, upvote_count: true, category: true, created_at: true },
    });

    if (!feedback) {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    if (feedback.status === 'spam') {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    if (feedback.status === 'closed' || feedback.status === 'resolved') {
      throw createError('Cannot upvote resolved or closed feedback', 400, 'UPVOTE_CLOSED');
    }

    const newUpvoteCount = feedback.upvote_count + 1;
    const newPriority = computePriorityScore(newUpvoteCount, feedback.category, feedback.created_at);

    const updated = await prisma.feedback.update({
      where: { id: feedback.id },
      data: {
        upvote_count: newUpvoteCount,
        priority_score: newPriority,
      },
      select: {
        tracking_id: true,
        upvote_count: true,
      },
    });

    return updated;
  });
}

// ─── Public Stats ───────────────────────────────────────
export async function getPublicStats() {
  return withRetry(async () => {
    // Sequential queries to avoid connection pool exhaustion
    const totalSubmissions = await prisma.feedback.count({
      where: { status: { not: 'spam' } },
    });

    const totalResolved = await prisma.feedback.count({
      where: { status: 'resolved' },
    });

    // Compute average resolution time in days
    const resolvedFeedback = await prisma.feedback.findMany({
      where: {
        status: 'resolved',
        resolved_at: { not: null },
      },
      select: { created_at: true, resolved_at: true },
    });

    let averageResolutionDays = 0;
    if (resolvedFeedback.length > 0) {
      const totalDays = resolvedFeedback.reduce(
        (sum: number, fb: typeof resolvedFeedback[number]) => {
          const diff = fb.resolved_at!.getTime() - fb.created_at.getTime();
          return sum + diff / (1000 * 60 * 60 * 24);
        },
        0,
      );
      averageResolutionDays = Math.round((totalDays / resolvedFeedback.length) * 10) / 10;
    }

    return {
      total_submissions: totalSubmissions,
      total_resolved: totalResolved,
      average_resolution_days: averageResolutionDays,
    };
  });
}
