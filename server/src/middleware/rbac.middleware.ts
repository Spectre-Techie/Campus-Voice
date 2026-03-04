import { Request, Response, NextFunction } from 'express';
import type { AdminRole } from '../types';

// ─── RBAC Middleware ─────────────────────────────────────
// Checks that the authenticated admin has one of the allowed roles.
// Must be used AFTER authenticate middleware.

export function authorize(...allowedRoles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.admin.role as AdminRole)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action',
        },
      });
      return;
    }

    next();
  };
}
