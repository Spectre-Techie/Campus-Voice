import { Request, Response, NextFunction } from 'express';
import * as feedbackService from '../services/feedback.service';
import { logger } from '../utils/logger';

// ─── POST /api/feedback — Submit new feedback ───────────
export async function submitFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const feedback = await feedbackService.createFeedback(req.body);

    logger.info('Feedback submitted', {
      tracking_id: feedback.tracking_id,
      category: feedback.category,
    });

    res.status(201).json({
      success: true,
      data: {
        tracking_id: feedback.tracking_id,
        message: 'Your feedback has been submitted anonymously. Use the tracking ID to follow up.',
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/feedback — List feedback (paginated) ──────
export async function listFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await feedbackService.listFeedback(req.query as any);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/feedback/:trackingId — Get single feedback ─
export async function getFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const feedback = await feedbackService.getFeedbackByTrackingId(req.params.trackingId as string);

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
}

// ─── POST /api/feedback/:trackingId/upvote — Upvote ─────
export async function upvoteFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await feedbackService.upvoteFeedback(req.params.trackingId as string);

    res.status(200).json({
      success: true,
      data: {
        tracking_id: result.tracking_id,
        upvote_count: result.upvote_count,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/stats/public — Public statistics ──────────
export async function getPublicStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await feedbackService.getPublicStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}
