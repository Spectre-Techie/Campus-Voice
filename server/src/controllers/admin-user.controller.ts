import { Request, Response, NextFunction } from 'express';
import * as adminUserService from '../services/admin-user.service';
import { logger } from '../utils/logger';

// ─── GET /api/admin/users ────────────────────────────────
export async function listAdmins(_req: Request, res: Response, next: NextFunction) {
  try {
    const admins = await adminUserService.listAdmins();

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/admin/users/:id ────────────────────────────
export async function getAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await adminUserService.getAdmin(req.params.id as string);

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}

// ─── POST /api/admin/users ───────────────────────────────
export async function createAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await adminUserService.createAdmin(req.body, req.admin!.sub);

    logger.info('Admin created', {
      new_admin: admin.username,
      role: admin.role,
      created_by: req.admin!.username,
    });

    res.status(201).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/admin/users/:id ──────────────────────────
export async function updateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await adminUserService.updateAdmin(
      req.params.id as string,
      req.body,
      req.admin!.sub,
    );

    logger.info('Admin updated', {
      admin: admin.username,
      updated_by: req.admin!.username,
    });

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}

// ─── DELETE /api/admin/users/:id ─────────────────────────
export async function deleteAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await adminUserService.deleteAdmin(
      req.params.id as string,
      req.admin!.sub,
    );

    logger.info('Admin deactivated', {
      admin: admin.username,
      deactivated_by: req.admin!.username,
    });

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}
