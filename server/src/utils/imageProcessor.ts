import sharp from 'sharp';

/**
 * Strip EXIF / metadata from an image buffer and normalise to a web-friendly
 * format while preserving quality.
 *
 * Returns a clean Buffer ready for Cloudinary upload.
 */
export async function stripExif(buffer: Buffer, mimetype: string): Promise<Buffer> {
  let pipeline = sharp(buffer).rotate(); // auto-orient based on EXIF, then strip

  switch (mimetype) {
    case 'image/png':
      pipeline = pipeline.png({ quality: 90 });
      break;
    case 'image/webp':
      pipeline = pipeline.webp({ quality: 85 });
      break;
    case 'image/jpeg':
    default:
      pipeline = pipeline.jpeg({ quality: 85 });
      break;
  }

  return pipeline.toBuffer();
}
