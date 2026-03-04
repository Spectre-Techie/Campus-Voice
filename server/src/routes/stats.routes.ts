import { Router, type IRouter } from 'express';
import * as feedbackController from '../controllers/feedback.controller';

const router: IRouter = Router();

// Public statistics
router.get('/public', feedbackController.getPublicStats);

export default router;
