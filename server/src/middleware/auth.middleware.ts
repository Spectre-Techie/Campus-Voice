import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type AccessTokenPayload } from '../utils/jwt';

// ─── Extend Express Request ──────────────────────────────
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AccessTokenPayload;
    }
  }
}

// ─── Auth Middleware ──────────────────────────────────────
// Verifies the Bearer access token and attaches decoded admin to req.admin

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization header',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.admin = payload;
    next();
  } catch (error) {
    const message =
      (error as { name?: string }).name === 'TokenExpiredError'
        ? 'Access token has expired'
        : 'Invalid access token';

    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
      },
    });
  }
}
