import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

// ─── Cookie Options ──────────────────────────────────────
const REFRESH_COOKIE_NAME = 'refresh_token';

function refreshCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/admin',        // scoped to admin routes only
    maxAge,                    // milliseconds
  };
}

// 7 days in ms
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// ─── POST /api/admin/login ───────────────────────────────
export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);

    // Set refresh token as httpOnly cookie
    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions(SEVEN_DAYS_MS));

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        admin: result.admin,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── POST /api/admin/refresh ─────────────────────────────
export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: {
          code: 'NO_REFRESH_TOKEN',
          message: 'Refresh token not found',
        },
      });
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        admin: result.admin,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── POST /api/admin/logout ──────────────────────────────
export async function logoutHandler(_req: Request, res: Response) {
  // Clear the refresh cookie
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/admin',
  });

  res.status(200).json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
}

// ─── GET /api/admin/me ───────────────────────────────────
export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await authService.getAdminProfile(req.admin!.sub);

    res.status(200).json({
      success: true,
      data: { admin },
    });
  } catch (error) {
    next(error);
  }
}
