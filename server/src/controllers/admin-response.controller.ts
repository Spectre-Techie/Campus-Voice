import { Request, Response, NextFunction } from 'express';
import * as responseService from '../services/response.service';
import * as analyticsService from '../services/analytics.service';
import { logger } from '../utils/logger';

// ─── POST /api/admin/feedback/:id/response ───────────────
export async function addResponse(req: Request, res: Response, next: NextFunction) {
  try {
    const feedbackId = req.params.id as string;
    const result = await responseService.addResponse(
      feedbackId,
      req.body,
      req.admin!.sub,
    );

    logger.info('Admin response added', {
      feedback_id: feedbackId,
      admin: req.admin!.username,
      status_changed: req.body.status_changed_to ?? null,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/admin/feedback/:id/responses ───────────────
export async function listResponses(req: Request, res: Response, next: NextFunction) {
  try {
    const feedbackId = req.params.id as string;
    const responses = await responseService.listResponses(feedbackId);

    res.status(200).json({
      success: true,
      data: responses,
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/admin/analytics ────────────────────────────
export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const analytics = await analyticsService.getAnalytics(
      req.admin!.role,
      req.admin!.department,
    );

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}
