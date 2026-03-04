import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';
import { checkMagicBytes } from '../middleware/upload';
import { stripExif } from '../utils/imageProcessor';
import { logger } from '../utils/logger';

/**
 * POST /api/upload
 *
 * Accepts a single image file (field name: "image").
 * - Validates magic bytes (not just extension)
 * - Strips EXIF metadata with sharp
 * - Uploads to Cloudinary under "campusvoice/" folder
 * - Returns the secure URL
 *
 * Open to anyone (public submissions are anonymous) but behind a rate limiter.
 */
export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No image file provided' },
      });
      return;
    }

    // ── Magic-byte validation ──────────────────────────
    const detectedMime = checkMagicBytes(file.buffer);
    if (!detectedMime) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE',
          message: 'File contents do not match a supported image type (JPEG, PNG, WebP)',
        },
      });
      return;
    }

    // ── Strip EXIF metadata ────────────────────────────
    const cleanBuffer = await stripExif(file.buffer, detectedMime);

    // ── Upload to Cloudinary ───────────────────────────
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'campusvoice',
            resource_type: 'image',
            transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error || !result) return reject(error ?? new Error('Upload failed'));
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
          },
        );
        stream.end(cleanBuffer);
      },
    );

    logger.info('Image uploaded', { public_id: result.public_id });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    next(error);
  }
}
