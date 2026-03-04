import { Router, type IRouter } from 'express';
import * as feedbackController from '../controllers/feedback.controller';
import { validate } from '../middleware/validate';
import { submitLimiter, upvoteLimiter } from '../middleware/rateLimiter';
import {
  submitFeedbackSchema,
  listFeedbackSchema,
  trackingIdParamSchema,
} from '../validators/feedback.schema';

const router: IRouter = Router();

// ─── Public Feedback Routes ─────────────────────────────

// Submit new feedback (rate-limited)
router.post(
  '/',
  submitLimiter,
  validate(submitFeedbackSchema, 'body'),
  feedbackController.submitFeedback
);

// List feedback with pagination, filtering, search
router.get(
  '/',
  validate(listFeedbackSchema, 'query'),
  feedbackController.listFeedback
);

// Get single feedback by tracking ID
router.get(
  '/:trackingId',
  validate(trackingIdParamSchema, 'params'),
  feedbackController.getFeedback
);

// Upvote feedback (rate-limited)
router.post(
  '/:trackingId/upvote',
  upvoteLimiter,
  validate(trackingIdParamSchema, 'params'),
  feedbackController.upvoteFeedback
);

export default router;
