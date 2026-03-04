import multer from 'multer';
import type { Request } from 'express';

// ─── Magic-byte file-type check ──────────────────────────
const ALLOWED_SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
];

function checkMagicBytes(buffer: Buffer): string | null {
  for (const sig of ALLOWED_SIGNATURES) {
    if (sig.bytes.every((b, i) => buffer[i] === b)) return sig.mime;
  }
  return null;
}

// ─── Multer config ───────────────────────────────────────
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export { checkMagicBytes, MAX_FILE_SIZE };
