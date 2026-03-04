import prisma, { withRetry } from '../config/database';
import { FeedbackCategory, FeedbackStatus, Prisma } from '@prisma/client';
import { computePriorityScore } from '../utils/priorityScore';
import { createError } from '../middleware/errorHandler';

// ─── Types ───────────────────────────────────────────────
export interface AdminListFeedbackInput {
  page: number;
  limit: number;
  category?: string;
  status?: string;
  sort: string;
  search?: string;
  department?: string;  // for department scoping
  is_spam?: string;     // spam filter: 'true' | 'false' | undefined
}

export interface UpdateStatusInput {
  status: string;
  comment: string;
}

export interface AssignDepartmentInput {
  department: string;
}

// ─── Admin: List All Feedback ────────────────────────────
// Includes spam, supports department scoping for dept admins
export async function adminListFeedback(
  input: AdminListFeedbackInput,
  adminRole: string,
  adminDepartment: string | null,
) {
  return withRetry(async () => {
    const { page, limit, category, status, sort, search, department, is_spam } = input;
    const skip = (page - 1) * limit;

    const where: Prisma.FeedbackWhereInput = {};

    // Department scoping: department admins only see their department
    if (adminRole === 'department_admin' && adminDepartment) {
      where.assigned_department = adminDepartment;
    } else if (department) {
      // Super admin can filter by department
      where.assigned_department = department;
    }

    if (category) {
      where.category = category as FeedbackCategory;
    }

    if (status) {
      where.status = status as FeedbackStatus;
    }

    // Spam filter: 'true' = only spam, 'false' = exclude spam
    if (is_spam === 'true') {
      where.status = 'spam';
    } else if (is_spam === 'false') {
      where.status = where.status ?? { not: 'spam' };
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
        assigned_department: true,
        priority_score: true,
        created_at: true,
        updated_at: true,
        resolved_at: true,
        _count: { select: { responses: true } },
      },
    });

    const total = await prisma.feedback.count({ where });
    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((item) => ({
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

// ─── Admin: Get Single Feedback ──────────────────────────
export async function adminGetFeedback(feedbackId: string) {
  return withRetry(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
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
                id: true,
                display_name: true,
                department: true,
              },
            },
          },
        },
        status_history: {
          orderBy: { changed_at: 'desc' },
          select: {
            id: true,
            old_status: true,
            new_status: true,
            comment: true,
            changed_by: true,
            changed_at: true,
            admin: {
              select: { display_name: true },
            },
          },
        },
        _count: { select: { responses: true } },
      },
    });

    if (!feedback) {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    return {
      ...feedback,
      response_count: feedback._count.responses,
      _count: undefined,
    };
  });
}

// ─── Admin: Update Feedback Status ───────────────────────
export async function updateFeedbackStatus(
  feedbackId: string,
  input: UpdateStatusInput,
  adminId: string,
) {
  return withRetry(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      select: { id: true, status: true, tracking_id: true, category: true, upvote_count: true, created_at: true },
    });

    if (!feedback) {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    const oldStatus = feedback.status;
    const newStatus = input.status as FeedbackStatus;

    if (oldStatus === newStatus) {
      throw createError('Status is already set to this value', 400, 'STATUS_UNCHANGED');
    }

    // Set resolved_at when transitioning to resolved
    const resolvedAt = newStatus === 'resolved' ? new Date() : undefined;
    // Clear resolved_at if moving away from resolved
    const clearResolved = oldStatus === 'resolved' && newStatus !== 'resolved'
      ? null
      : undefined;

    // Recalculate priority score
    const newPriority = computePriorityScore(
      feedback.upvote_count,
      feedback.category,
      feedback.created_at,
    );

    const updated = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        status: newStatus,
        priority_score: newPriority,
        ...(resolvedAt && { resolved_at: resolvedAt }),
        ...(clearResolved !== undefined && { resolved_at: clearResolved }),
      },
      select: {
        id: true,
        tracking_id: true,
        status: true,
        priority_score: true,
        resolved_at: true,
        updated_at: true,
      },
    });

    // Create status history entry
    await prisma.statusHistory.create({
      data: {
        feedback_id: feedbackId,
        old_status: oldStatus,
        new_status: newStatus,
        comment: input.comment,
        changed_by: adminId,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        admin_id: adminId,
        action: 'status_change',
        entity: 'feedback',
        entity_id: feedbackId,
        metadata: {
          tracking_id: feedback.tracking_id,
          from: oldStatus,
          to: newStatus,
          comment: input.comment,
        },
      },
    });

    return updated;
  });
}

// ─── Admin: Assign Department ────────────────────────────
export async function assignDepartment(
  feedbackId: string,
  input: AssignDepartmentInput,
  adminId: string,
) {
  return withRetry(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      select: { id: true, tracking_id: true, assigned_department: true },
    });

    if (!feedback) {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    const oldDepartment = feedback.assigned_department;

    const updated = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { assigned_department: input.department },
      select: {
        id: true,
        tracking_id: true,
        assigned_department: true,
        updated_at: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        admin_id: adminId,
        action: 'assign_department',
        entity: 'feedback',
        entity_id: feedbackId,
        metadata: {
          tracking_id: feedback.tracking_id,
          from: oldDepartment,
          to: input.department,
        },
      },
    });

    return updated;
  });
}

// ─── Admin: Flag as Spam ─────────────────────────────────
export async function flagAsSpam(
  feedbackId: string,
  adminId: string,
  markSpam: boolean = true,
) {
  return withRetry(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      select: { id: true, tracking_id: true, status: true, category: true, upvote_count: true, created_at: true },
    });

    if (!feedback) {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    const oldStatus = feedback.status;
    const newStatus: FeedbackStatus = markSpam ? 'spam' : 'submitted';

    if (markSpam && feedback.status === 'spam') {
      throw createError('Feedback is already flagged as spam', 400, 'ALREADY_SPAM');
    }

    if (!markSpam && feedback.status !== 'spam') {
      throw createError('Feedback is not flagged as spam', 400, 'NOT_SPAM');
    }

    const updated = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status: newStatus },
      select: {
        id: true,
        tracking_id: true,
        status: true,
        updated_at: true,
      },
    });

    // Status history
    await prisma.statusHistory.create({
      data: {
        feedback_id: feedbackId,
        old_status: oldStatus,
        new_status: newStatus,
        comment: markSpam ? 'Flagged as spam by admin' : 'Spam flag removed by admin',
        changed_by: adminId,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        admin_id: adminId,
        action: markSpam ? 'flag_spam' : 'unflag_spam',
        entity: 'feedback',
        entity_id: feedbackId,
        metadata: {
          tracking_id: feedback.tracking_id,
          from: oldStatus,
          to: newStatus,
        },
      },
    });

    return updated;
  });
}
