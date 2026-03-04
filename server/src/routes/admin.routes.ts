import { Router, type IRouter } from 'express';
import { loginHandler, refreshHandler, logoutHandler, meHandler } from '../controllers/auth.controller';
import * as adminFeedbackCtrl from '../controllers/admin-feedback.controller';
import * as adminResponseCtrl from '../controllers/admin-response.controller';
import * as adminUserCtrl from '../controllers/admin-user.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { loginLimiter } from '../middleware/rateLimiter';
import { loginSchema } from '../validators/auth.schema';
import {
  adminListFeedbackSchema,
  updateStatusSchema,
  assignDepartmentSchema,
  spamToggleSchema,
  feedbackIdParamSchema,
} from '../validators/admin-feedback.schema';
import { addResponseSchema } from '../validators/response.schema';
import {
  createAdminSchema,
  updateAdminSchema,
  adminIdParamSchema,
} from '../validators/admin-user.schema';

const router: IRouter = Router();

// ─── Public auth routes ──────────────────────────────────
router.post('/login',   loginLimiter, validate(loginSchema), loginHandler);
router.post('/refresh', refreshHandler);
router.post('/logout',  logoutHandler);

// ─── Protected auth routes ───────────────────────────────
router.get('/me', authenticate, meHandler);

// ─── Admin Feedback Management (all protected) ───────────
router.get(
  '/feedback',
  authenticate,
  authorize('super_admin', 'department_admin', 'viewer'),
  validate(adminListFeedbackSchema, 'query'),
  adminFeedbackCtrl.listFeedback,
);

router.get(
  '/feedback/:id',
  authenticate,
  authorize('super_admin', 'department_admin', 'viewer'),
  validate(feedbackIdParamSchema, 'params'),
  adminFeedbackCtrl.getFeedback,
);

router.patch(
  '/feedback/:id/status',
  authenticate,
  authorize('super_admin', 'department_admin'),
  validate(feedbackIdParamSchema, 'params'),
  validate(updateStatusSchema),
  adminFeedbackCtrl.updateStatus,
);

router.patch(
  '/feedback/:id/assign',
  authenticate,
  authorize('super_admin'),
  validate(feedbackIdParamSchema, 'params'),
  validate(assignDepartmentSchema),
  adminFeedbackCtrl.assignDepartment,
);

router.patch(
  '/feedback/:id/spam',
  authenticate,
  authorize('super_admin', 'department_admin'),
  validate(feedbackIdParamSchema, 'params'),
  validate(spamToggleSchema),
  adminFeedbackCtrl.toggleSpam,
);

// ─── Admin Response System ───────────────────────────────
router.post(
  '/feedback/:id/response',
  authenticate,
  authorize('super_admin', 'department_admin'),
  validate(feedbackIdParamSchema, 'params'),
  validate(addResponseSchema),
  adminResponseCtrl.addResponse,
);

router.get(
  '/feedback/:id/responses',
  authenticate,
  authorize('super_admin', 'department_admin', 'viewer'),
  validate(feedbackIdParamSchema, 'params'),
  adminResponseCtrl.listResponses,
);

// ─── Analytics ───────────────────────────────────────────
router.get(
  '/analytics',
  authenticate,
  authorize('super_admin', 'department_admin', 'viewer'),
  adminResponseCtrl.getAnalytics,
);

// ─── User Management (super_admin only) ─────────────────
router.get(
  '/users',
  authenticate,
  authorize('super_admin'),
  adminUserCtrl.listAdmins,
);

router.get(
  '/users/:id',
  authenticate,
  authorize('super_admin'),
  validate(adminIdParamSchema, 'params'),
  adminUserCtrl.getAdmin,
);

router.post(
  '/users',
  authenticate,
  authorize('super_admin'),
  validate(createAdminSchema),
  adminUserCtrl.createAdmin,
);

router.patch(
  '/users/:id',
  authenticate,
  authorize('super_admin'),
  validate(adminIdParamSchema, 'params'),
  validate(updateAdminSchema),
  adminUserCtrl.updateAdmin,
);

router.delete(
  '/users/:id',
  authenticate,
  authorize('super_admin'),
  validate(adminIdParamSchema, 'params'),
  adminUserCtrl.deleteAdmin,
);

export default router;
