import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../middleware/upload';
import { uploadImage } from '../controllers/upload.controller';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/upload
 * Accepts multipart/form-data with a single file field "image".
 * Rate-limited to 20 uploads / 15 min per IP.
 *
 * Returns: { success: true, data: { url, public_id } }
 */
router.post(
  '/',
  uploadLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const messages: Record<string, string> = {
          LIMIT_FILE_SIZE: 'File too large. Maximum size is 5 MB.',
          LIMIT_UNEXPECTED_FILE: 'Unexpected file field. Use field name "image".',
        };
        res.status(400).json({
          success: false,
          error: {
            code: 'FILE_UPLOAD_ERROR',
            message: messages[err.code] || err.message,
          },
        });
        return;
      }
      if (err) {
        res.status(400).json({
          success: false,
          error: { code: 'FILE_UPLOAD_ERROR', message: err.message },
        });
        return;
      }
      next();
    });
  },
  uploadImage,
);

export default router;
