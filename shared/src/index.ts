// =============================================
// CampusVoice — Shared Types
// Used by both client and server
// =============================================

// --- Categories ---
export const CATEGORIES = [
  'Academics',
  'Facilities',
  'Welfare',
  'Security',
  'IT Services',
  'Others',
] as const;

export type FeedbackCategory = (typeof CATEGORIES)[number];

// --- Statuses ---
export const STATUSES = [
  'submitted',
  'under_review',
  'in_progress',
  'resolved',
  'closed',
  'spam',
] as const;

export type FeedbackStatus = (typeof STATUSES)[number];

// Statuses visible on the public board (excludes spam)
export const PUBLIC_STATUSES = STATUSES.filter((s) => s !== 'spam');

// --- Admin Roles ---
export const ADMIN_ROLES = ['super_admin', 'department_admin', 'viewer'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

// --- Status Display Config ---
export const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  submitted: {
    label: 'Submitted',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: '○',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: '👁',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: '⚡',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: '✓',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    icon: '✕',
  },
  spam: {
    label: 'Spam',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '🚫',
  },
};

// --- Category Display Config ---
export const CATEGORY_CONFIG: Record<
  FeedbackCategory,
  { icon: string; color: string }
> = {
  Academics: { icon: '📚', color: 'text-purple-600' },
  Facilities: { icon: '🏫', color: 'text-orange-600' },
  Welfare: { icon: '💚', color: 'text-green-600' },
  Security: { icon: '🔒', color: 'text-red-600' },
  'IT Services': { icon: '💻', color: 'text-blue-600' },
  Others: { icon: '📋', color: 'text-gray-600' },
};

// --- Priority Score Weights ---
export const CATEGORY_WEIGHTS: Record<FeedbackCategory, number> = {
  Security: 10,
  Welfare: 8,
  Facilities: 6,
  Academics: 5,
  'IT Services': 4,
  Others: 2,
};

// --- API Response Types ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// --- Feedback Types ---
export interface FeedbackSummary {
  id: string;
  tracking_id: string;
  category: FeedbackCategory;
  title: string;
  description: string;
  image_url: string | null;
  status: FeedbackStatus;
  upvote_count: number;
  response_count: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface FeedbackDetail extends FeedbackSummary {
  assigned_department: string | null;
  responses: AdminResponseItem[];
  status_history: StatusHistoryItem[];
}

export interface AdminResponseItem {
  id: string;
  admin_name: string;
  admin_department: string | null;
  response_text: string;
  status_changed_to: FeedbackStatus | null;
  proof_image_url: string | null;
  created_at: string;
}

export interface StatusHistoryItem {
  status: FeedbackStatus;
  comment: string | null;
  changed_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
}

export interface PublicStats {
  total_submissions: number;
  total_resolved: number;
  average_resolution_days: number;
}

// --- Admin Types ---
export interface AdminUser {
  id: string;
  username: string;
  display_name: string;
  role: AdminRole;
  department: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AnalyticsSummary {
  total_submissions: number;
  total_this_month: number;
  resolution_rate: number;
  average_resolution_days: number;
  pending_over_7_days: number;
  category_breakdown: Record<FeedbackCategory, number>;
  top_unresolved: Array<{
    tracking_id: string;
    title: string;
    category: FeedbackCategory;
    upvote_count: number;
    days_pending: number;
  }>;
}
