// Type definitions shared across the server
// More types will be added as features are built

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export type FeedbackCategory =
  | 'Academics'
  | 'Facilities'
  | 'Welfare'
  | 'Security'
  | 'IT Services'
  | 'Others';

export type FeedbackStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'spam';

export type AdminRole = 'super_admin' | 'department_admin' | 'viewer';
