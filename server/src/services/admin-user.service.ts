import bcrypt from 'bcryptjs';
import prisma, { withRetry } from '../config/database';
import { AdminRole } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

// ─── Types ───────────────────────────────────────────────
export interface CreateAdminInput {
  username: string;
  display_name: string;
  password: string;
  role: string;
  department?: string | null;
}

export interface UpdateAdminInput {
  display_name?: string;
  password?: string;
  role?: string;
  department?: string | null;
  is_active?: boolean;
}

const ADMIN_SELECT = {
  id: true,
  username: true,
  display_name: true,
  role: true,
  department: true,
  is_active: true,
  last_login_at: true,
  created_at: true,
  updated_at: true,
} as const;

// ─── List Admins ─────────────────────────────────────────
export async function listAdmins() {
  return withRetry(async () => {
    const admins = await prisma.admin.findMany({
      select: {
        ...ADMIN_SELECT,
        _count: { select: { responses: true, audit_logs: true } },
      },
      orderBy: { created_at: 'asc' },
    });

    return admins.map((a) => ({
      ...a,
      response_count: a._count.responses,
      action_count: a._count.audit_logs,
      _count: undefined,
    }));
  });
}

// ─── Get Single Admin ────────────────────────────────────
export async function getAdmin(adminId: string) {
  return withRetry(async () => {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        ...ADMIN_SELECT,
        _count: { select: { responses: true, status_changes: true, audit_logs: true } },
      },
    });

    if (!admin) {
      throw createError('Admin not found', 404, 'ADMIN_NOT_FOUND');
    }

    return {
      ...admin,
      response_count: admin._count.responses,
      status_change_count: admin._count.status_changes,
      action_count: admin._count.audit_logs,
      _count: undefined,
    };
  });
}

// ─── Create Admin ────────────────────────────────────────
export async function createAdmin(
  input: CreateAdminInput,
  createdByAdminId: string,
) {
  return withRetry(async () => {
    // Check username uniqueness
    const existing = await prisma.admin.findUnique({
      where: { username: input.username },
      select: { id: true },
    });

    if (existing) {
      throw createError('Username is already taken', 409, 'USERNAME_TAKEN');
    }

    // Hash password with bcrypt cost 12
    const passwordHash = await bcrypt.hash(input.password, 12);

    const admin = await prisma.admin.create({
      data: {
        username: input.username,
        display_name: input.display_name,
        password_hash: passwordHash,
        role: input.role as AdminRole,
        department: input.department ?? null,
        is_active: true,
      },
      select: ADMIN_SELECT,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        admin_id: createdByAdminId,
        action: 'create_admin',
        entity: 'admin',
        entity_id: admin.id,
        metadata: {
          username: admin.username,
          role: admin.role,
          department: admin.department,
        },
      },
    });

    return admin;
  });
}

// ─── Update Admin ────────────────────────────────────────
export async function updateAdmin(
  adminId: string,
  input: UpdateAdminInput,
  updatedByAdminId: string,
) {
  return withRetry(async () => {
    const existing = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, username: true, role: true, department: true, is_active: true },
    });

    if (!existing) {
      throw createError('Admin not found', 404, 'ADMIN_NOT_FOUND');
    }

    // Build update data
    const data: Record<string, unknown> = {};

    if (input.display_name !== undefined) {
      data.display_name = input.display_name;
    }

    if (input.role !== undefined) {
      data.role = input.role as AdminRole;
    }

    if (input.department !== undefined) {
      data.department = input.department;
    }

    if (input.is_active !== undefined) {
      data.is_active = input.is_active;
    }

    if (input.password) {
      data.password_hash = await bcrypt.hash(input.password, 12);
    }

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data,
      select: ADMIN_SELECT,
    });

    // Audit log
    const changes: Record<string, unknown> = {};
    if (input.display_name !== undefined) changes.display_name = input.display_name;
    if (input.role !== undefined) changes.role = input.role;
    if (input.department !== undefined) changes.department = input.department;
    if (input.is_active !== undefined) changes.is_active = input.is_active;
    if (input.password) changes.password_reset = true;

    await prisma.auditLog.create({
      data: {
        admin_id: updatedByAdminId,
        action: 'update_admin',
        entity: 'admin',
        entity_id: adminId,
        metadata: {
          username: existing.username,
          changes: changes as Record<string, string | boolean>,
        },
      },
    });

    return admin;
  });
}

// ─── Soft Delete Admin ───────────────────────────────────
export async function deleteAdmin(
  adminId: string,
  deletedByAdminId: string,
) {
  return withRetry(async () => {
    const existing = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, username: true, is_active: true },
    });

    if (!existing) {
      throw createError('Admin not found', 404, 'ADMIN_NOT_FOUND');
    }

    // Prevent self-deletion
    if (adminId === deletedByAdminId) {
      throw createError('You cannot deactivate your own account', 400, 'SELF_DELETE');
    }

    if (!existing.is_active) {
      throw createError('Admin is already deactivated', 400, 'ALREADY_DEACTIVATED');
    }

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: { is_active: false },
      select: ADMIN_SELECT,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        admin_id: deletedByAdminId,
        action: 'deactivate_admin',
        entity: 'admin',
        entity_id: adminId,
        metadata: { username: existing.username },
      },
    });

    return admin;
  });
}
