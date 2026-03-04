import { z } from 'zod';

const ROLES = ['super_admin', 'department_admin', 'viewer'] as const;

const DEPARTMENTS = [
  'Academics',
  'Facilities',
  'Welfare',
  'Security',
  'IT Services',
] as const;

// ─── Create Admin ────────────────────────────────────────
export const createAdminSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  display_name: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must not exceed 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum(ROLES, {
    errorMap: () => ({ message: `Role must be one of: ${ROLES.join(', ')}` }),
  }),
  department: z
    .enum(DEPARTMENTS, {
      errorMap: () => ({ message: `Department must be one of: ${DEPARTMENTS.join(', ')}` }),
    })
    .optional()
    .nullable(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;

// ─── Update Admin ────────────────────────────────────────
export const updateAdminSchema = z
  .object({
    display_name: z
      .string()
      .trim()
      .min(2, 'Display name must be at least 2 characters')
      .max(100, 'Display name must not exceed 100 characters')
      .optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must not exceed 128 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .optional(),
    role: z
      .enum(ROLES, {
        errorMap: () => ({ message: `Role must be one of: ${ROLES.join(', ')}` }),
      })
      .optional(),
    department: z
      .enum(DEPARTMENTS, {
        errorMap: () => ({ message: `Department must be one of: ${DEPARTMENTS.join(', ')}` }),
      })
      .optional()
      .nullable(),
    is_active: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' },
  );

export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;

// ─── Admin ID Param ──────────────────────────────────────
export const adminIdParamSchema = z.object({
  id: z.string().uuid('Invalid admin ID format'),
});
