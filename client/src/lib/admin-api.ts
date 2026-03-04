import axios from "axios";
import type { ApiSuccess } from "./api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Admin Axios Instance ───────────────────────────────

export const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send httpOnly refresh cookie
});

// Attach access token to every request
adminApi.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) =>
    token ? prom.resolve(token) : prom.reject(error)
  );
  failedQueue = [];
}

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login") &&
      !originalRequest.url?.includes("/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(adminApi(originalRequest));
            },
            reject,
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await adminApi.post<
          ApiSuccess<{ accessToken: string }>
        >("/refresh");
        const newToken = data.data.accessToken;
        localStorage.setItem("admin_token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return adminApi(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("admin_token");
        if (typeof window !== "undefined") {
          window.location.href = "/admin/login";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ─── Types ──────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  display_name: string;
  role: "super_admin" | "department_admin" | "viewer";
  department: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile extends AdminUser {
  response_count?: number;
  status_change_count?: number;
  action_count?: number;
}

export interface LoginResponse {
  accessToken: string;
  admin: AdminUser;
}

export interface AdminFeedbackItem {
  id: string;
  tracking_id: string;
  category: string;
  title: string;
  description: string;
  image_url: string | null;
  status: string;
  is_spam: boolean;
  upvote_count: number;
  assigned_department: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  response_count: number;
}

export interface AdminFeedbackDetail extends AdminFeedbackItem {
  responses: AdminResponseItem[];
  status_history: StatusHistoryItem[];
}

export interface AdminResponseItem {
  id: string;
  admin_name: string;
  admin_department: string | null;
  response_text: string;
  status_changed_to: string | null;
  proof_image_url: string | null;
  expected_resolution: string | null;
  created_at: string;
}

export interface StatusHistoryItem {
  status: string;
  comment: string | null;
  changed_by: string | null;
  changed_at: string;
}

export interface AnalyticsData {
  summary: {
    total_submissions: number;
    total_resolved: number;
    resolution_rate: number;
    average_resolution_days: number;
    pending_over_7_days: number;
    total_in_progress: number;
    total_under_review: number;
  };
  category_breakdown: Array<{
    category: string;
    count: number;
    resolved: number;
    resolution_rate: number;
  }>;
  status_distribution: Array<{
    status: string;
    count: number;
  }>;
  top_unresolved: Array<{
    id: string;
    tracking_id: string;
    title: string;
    category: string;
    status: string;
    upvote_count: number;
    priority_score: number;
    days_open: number;
    created_at: string;
  }>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
}

// ─── Auth API ───────────────────────────────────────────

export async function adminLogin(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await adminApi.post<ApiSuccess<LoginResponse>>("/login", {
    username,
    password,
  });
  return res.data.data;
}

export async function adminLogout(): Promise<void> {
  await adminApi.post("/logout");
}

export async function adminGetMe(): Promise<AdminUser> {
  const res = await adminApi.get<ApiSuccess<AdminUser>>("/me");
  return res.data.data;
}

// ─── Feedback Management API ────────────────────────────

export async function adminListFeedback(params: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  sort?: string;
  search?: string;
  is_spam?: boolean;
}): Promise<{ items: AdminFeedbackItem[]; pagination: Pagination }> {
  const res = await adminApi.get<{
    success: true;
    data: AdminFeedbackItem[];
    pagination: Pagination;
  }>("/feedback", { params });
  return { items: res.data.data, pagination: res.data.pagination };
}

export async function adminGetFeedback(
  id: string
): Promise<AdminFeedbackDetail> {
  const res = await adminApi.get<ApiSuccess<AdminFeedbackDetail>>(
    `/feedback/${id}`
  );
  return res.data.data;
}

export async function adminUpdateStatus(
  id: string,
  data: { status: string; comment: string }
): Promise<AdminFeedbackDetail> {
  const res = await adminApi.patch<ApiSuccess<AdminFeedbackDetail>>(
    `/feedback/${id}/status`,
    data
  );
  return res.data.data;
}

export async function adminAssignDepartment(
  id: string,
  department: string
): Promise<AdminFeedbackDetail> {
  const res = await adminApi.patch<ApiSuccess<AdminFeedbackDetail>>(
    `/feedback/${id}/assign`,
    { department }
  );
  return res.data.data;
}

export async function adminToggleSpam(
  id: string,
  is_spam: boolean
): Promise<AdminFeedbackDetail> {
  const res = await adminApi.patch<ApiSuccess<AdminFeedbackDetail>>(
    `/feedback/${id}/spam`,
    { is_spam }
  );
  return res.data.data;
}

// ─── Responses API ──────────────────────────────────────

export async function adminAddResponse(
  feedbackId: string,
  data: {
    response_text: string;
    proof_image_url?: string;
    expected_resolution?: string;
    status_changed_to?: string;
  }
): Promise<AdminResponseItem> {
  const res = await adminApi.post<ApiSuccess<AdminResponseItem>>(
    `/feedback/${feedbackId}/response`,
    data
  );
  return res.data.data;
}

export async function adminListResponses(
  feedbackId: string
): Promise<AdminResponseItem[]> {
  const res = await adminApi.get<ApiSuccess<AdminResponseItem[]>>(
    `/feedback/${feedbackId}/responses`
  );
  return res.data.data;
}

// ─── Analytics API ──────────────────────────────────────

export async function adminGetAnalytics(): Promise<AnalyticsData> {
  const res = await adminApi.get<ApiSuccess<AnalyticsData>>("/analytics", {
    timeout: 30_000,
  });
  return res.data.data;
}

// ─── User Management API ────────────────────────────────

export async function adminListUsers(): Promise<AdminProfile[]> {
  const res = await adminApi.get<ApiSuccess<AdminProfile[]>>("/users");
  return res.data.data;
}

export async function adminGetUser(id: string): Promise<AdminProfile> {
  const res = await adminApi.get<ApiSuccess<AdminProfile>>(`/users/${id}`);
  return res.data.data;
}

export async function adminCreateUser(data: {
  username: string;
  display_name: string;
  password: string;
  role: string;
  department?: string;
}): Promise<AdminUser> {
  const res = await adminApi.post<ApiSuccess<AdminUser>>("/users", data);
  return res.data.data;
}

export async function adminUpdateUser(
  id: string,
  data: {
    display_name?: string;
    role?: string;
    department?: string;
    password?: string;
    is_active?: boolean;
  }
): Promise<AdminUser> {
  const res = await adminApi.patch<ApiSuccess<AdminUser>>(`/users/${id}`, data);
  return res.data.data;
}

export async function adminDeleteUser(id: string): Promise<AdminUser> {
  const res = await adminApi.delete<ApiSuccess<AdminUser>>(`/users/${id}`);
  return res.data.data;
}
