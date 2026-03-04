import prisma, { withRetry } from '../config/database';
import { FeedbackStatus } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

// ─── Types ───────────────────────────────────────────────
export interface AddResponseInput {
  response_text: string;
  proof_image_url?: string | null;
  expected_resolution?: string | null; // ISO date string
  status_changed_to?: string | null;
}

// ─── Add Admin Response ──────────────────────────────────
export async function addResponse(
  feedbackId: string,
  input: AddResponseInput,
  adminId: string,
) {
  return withRetry(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      select: { id: true, tracking_id: true, status: true },
    });

    if (!feedback) {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    // Build response data
    const responseData: {
      feedback_id: string;
      admin_id: string;
      response_text: string;
      proof_image_url?: string | null;
      expected_resolution?: Date | null;
      status_changed_to?: FeedbackStatus | null;
    } = {
      feedback_id: feedbackId,
      admin_id: adminId,
      response_text: input.response_text,
      proof_image_url: input.proof_image_url ?? null,
      expected_resolution: input.expected_resolution
        ? new Date(input.expected_resolution)
        : null,
      status_changed_to: input.status_changed_to
        ? (input.status_changed_to as FeedbackStatus)
        : null,
    };

    const response = await prisma.adminResponse.create({
      data: responseData,
      select: {
        id: true,
        response_text: true,
        status_changed_to: true,
        proof_image_url: true,
        expected_resolution: true,
        created_at: true,
        admin: {
          select: {
            id: true,
            display_name: true,
            department: true,
          },
        },
      },
    });

    // If a status change was included, update the feedback status
    if (input.status_changed_to) {
      const newStatus = input.status_changed_to as FeedbackStatus;
      const oldStatus = feedback.status;

      if (newStatus !== oldStatus) {
        await prisma.feedback.update({
          where: { id: feedbackId },
          data: {
            status: newStatus,
            ...(newStatus === 'resolved' ? { resolved_at: new Date() } : {}),
            ...(oldStatus === 'resolved' && newStatus !== 'resolved'
              ? { resolved_at: null }
              : {}),
          },
        });

        // Status history entry
        await prisma.statusHistory.create({
          data: {
            feedback_id: feedbackId,
            old_status: oldStatus,
            new_status: newStatus,
            comment: `Status changed with response: ${input.response_text.substring(0, 100)}`,
            changed_by: adminId,
          },
        });
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        admin_id: adminId,
        action: 'respond',
        entity: 'feedback',
        entity_id: feedbackId,
        metadata: {
          tracking_id: feedback.tracking_id,
          response_preview: input.response_text.substring(0, 100),
          status_changed_to: input.status_changed_to ?? null,
        },
      },
    });

    return response;
  });
}

// ─── List Responses for a Feedback ───────────────────────
export async function listResponses(feedbackId: string) {
  return withRetry(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      select: { id: true },
    });

    if (!feedback) {
      throw createError('Feedback not found', 404, 'NOT_FOUND');
    }

    const responses = await prisma.adminResponse.findMany({
      where: { feedback_id: feedbackId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        response_text: true,
        status_changed_to: true,
        proof_image_url: true,
        expected_resolution: true,
        created_at: true,
        admin: {
          select: {
            id: true,
            display_name: true,
            department: true,
          },
        },
      },
    });

    return responses;
  });
}
