import {
  BookOpen,
  Building2,
  Heart,
  Shield,
  Monitor,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

// ─── Categories ─────────────────────────────────────────

export const CATEGORIES = [
  "Academics",
  "Facilities",
  "Welfare",
  "Security",
  "IT_Services",
  "Others",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; icon: LucideIcon; color: string; bgColor: string }
> = {
  Academics: {
    label: "Academics",
    icon: BookOpen,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  Facilities: {
    label: "Facilities",
    icon: Building2,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
  },
  Welfare: {
    label: "Welfare",
    icon: Heart,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/50",
  },
  Security: {
    label: "Security",
    icon: Shield,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/50",
  },
  IT_Services: {
    label: "IT Services",
    icon: Monitor,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
  },
  Others: {
    label: "Others",
    icon: MoreHorizontal,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
  },
};

// ─── Statuses ───────────────────────────────────────────

export const STATUSES = [
  "submitted",
  "under_review",
  "in_progress",
  "resolved",
  "closed",
  "spam",
] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  submitted: {
    label: "Submitted",
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-800/50",
    dotColor: "bg-slate-500",
  },
  under_review: {
    label: "Under Review",
    color: "text-yellow-700 dark:text-yellow-300",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    dotColor: "bg-yellow-500",
  },
  in_progress: {
    label: "In Progress",
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    dotColor: "bg-blue-500",
  },
  resolved: {
    label: "Resolved",
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    dotColor: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
    dotColor: "bg-gray-500",
  },
  spam: {
    label: "Flagged as Spam",
    color: "text-red-700 dark:text-red-300",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    dotColor: "bg-red-500",
  },
};

// ─── Sort Options ───────────────────────────────────────

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most_upvoted", label: "Most Upvoted" },
  { value: "priority", label: "Priority" },
] as const;
