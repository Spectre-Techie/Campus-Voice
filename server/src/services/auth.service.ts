import bcrypt from 'bcryptjs';
import prisma, { withRetry } from '../config/database';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { createError } from '../middleware/errorHandler';

// ─── Types ───────────────────────────────────────────────
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    username: string;
    display_name: string;
    role: string;
    department: string | null;
  };
}

export interface RefreshResult {
  accessToken: string;
  admin: {
    id: string;
    username: string;
    role: string;
    department: string | null;
  };
}

// ─── Login ───────────────────────────────────────────────
export async function login(username: string, password: string): Promise<LoginResult> {
  // Find admin by username
  const admin = await withRetry(() =>
    prisma.admin.findUnique({ where: { username } }),
  );

  if (!admin) {
    throw createError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
  }

  if (!admin.is_active) {
    throw createError('Account is deactivated. Contact a super admin.', 403, 'ACCOUNT_DEACTIVATED');
  }

  // Verify password (bcrypt cost factor 12 used in seed)
  const passwordValid = await bcrypt.compare(password, admin.password_hash);
  if (!passwordValid) {
    throw createError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
  }

  // Update last_login_at
  await withRetry(() =>
    prisma.admin.update({
      where: { id: admin.id },
      data: { last_login_at: new Date() },
    }),
  );

  // Log login to audit
  await withRetry(() =>
    prisma.auditLog.create({
      data: {
        admin_id: admin.id,
        action: 'login',
        entity: 'admin',
        entity_id: admin.id,
        metadata: { ip: 'redacted' },
      },
    }),
  );

  // Generate tokens
  const accessToken = generateAccessToken({
    sub: admin.id,
    username: admin.username,
    role: admin.role,
    department: admin.department,
  });

  const refreshToken = generateRefreshToken(admin.id);

  return {
    accessToken,
    refreshToken,
    admin: {
      id: admin.id,
      username: admin.username,
      display_name: admin.display_name,
      role: admin.role,
      department: admin.department,
    },
  };
}

// ─── Refresh Token ───────────────────────────────────────
export async function refreshAccessToken(refreshToken: string): Promise<RefreshResult> {
  // Verify the refresh token
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw createError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  // Look up admin — ensure they still exist and are active
  const admin = await withRetry(() =>
    prisma.admin.findUnique({ where: { id: payload.sub } }),
  );

  if (!admin) {
    throw createError('Admin not found', 401, 'ADMIN_NOT_FOUND');
  }

  if (!admin.is_active) {
    throw createError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
  }

  // Issue new access token
  const accessToken = generateAccessToken({
    sub: admin.id,
    username: admin.username,
    role: admin.role,
    department: admin.department,
  });

  return {
    accessToken,
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      department: admin.department,
    },
  };
}

// ─── Get Current Admin Profile ───────────────────────────
export async function getAdminProfile(adminId: string) {
  const admin = await withRetry(() =>
    prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        display_name: true,
        role: true,
        department: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
      },
    }),
  );

  if (!admin) {
    throw createError('Admin not found', 404, 'ADMIN_NOT_FOUND');
  }

  return admin;
}
