import { Request, Response, NextFunction } from 'express';
import * as adminFeedbackService from '../services/admin-feedback.service';
import { logger } from '../utils/logger';

// ─── GET /api/admin/feedback ─────────────────────────────
export async function listFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminFeedbackService.adminListFeedback(
      req.query as any,
      req.admin!.role,
      req.admin!.department,
    );

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/admin/feedback/:id ─────────────────────────
export async function getFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const feedbackId = req.params.id as string;
    const feedback = await adminFeedbackService.adminGetFeedback(feedbackId);

    // Department scoping: dept admins can only view their department's feedback
    if (
      req.admin!.role === 'department_admin' &&
      req.admin!.department &&
      feedback.assigned_department !== req.admin!.department
    ) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'This feedback is not assigned to your department',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/admin/feedback/:id/status ────────────────
export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const feedbackId = req.params.id as string;
    const result = await adminFeedbackService.updateFeedbackStatus(
      feedbackId,
      req.body,
      req.admin!.sub,
    );

    logger.info('Feedback status updated', {
      feedback_id: feedbackId,
      new_status: req.body.status,
      admin: req.admin!.username,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/admin/feedback/:id/assign ────────────────
export async function assignDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const feedbackId = req.params.id as string;
    const result = await adminFeedbackService.assignDepartment(
      feedbackId,
      req.body,
      req.admin!.sub,
    );

    logger.info('Feedback department assigned', {
      feedback_id: feedbackId,
      department: req.body.department,
      admin: req.admin!.username,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/admin/feedback/:id/spam ──────────────────
export async function toggleSpam(req: Request, res: Response, next: NextFunction) {
  try {
    const feedbackId = req.params.id as string;
    const result = await adminFeedbackService.flagAsSpam(
      feedbackId,
      req.admin!.sub,
      req.body.spam,
    );

    logger.info('Feedback spam toggled', {
      feedback_id: feedbackId,
      spam: req.body.spam,
      admin: req.admin!.username,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
