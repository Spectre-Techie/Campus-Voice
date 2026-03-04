import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Response Types ─────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Pagination ─────────────────────────────────────────

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
}

// ─── Feedback Types ─────────────────────────────────────

export interface FeedbackSubmitResponse {
  tracking_id: string;
  message: string;
}

export interface FeedbackItem {
  id: string;
  tracking_id: string;
  category: string;
  title: string;
  description: string;
  image_url: string | null;
  status: string;
  upvote_count: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  response_count: number;
}

export interface FeedbackDetail extends FeedbackItem {
  assigned_department: string | null;
  responses: FeedbackResponse[];
  status_history: StatusHistoryEntry[];
}

export interface FeedbackResponse {
  id: string;
  admin_name: string;
  admin_department: string | null;
  response_text: string;
  status_changed_to: string | null;
  proof_image_url: string | null;
  created_at: string;
}

export interface StatusHistoryEntry {
  status: string;
  comment: string | null;
  changed_at: string;
}

export interface PublicStats {
  total_submissions: number;
  total_resolved: number;
  average_resolution_days: number;
}

// ─── API Functions ──────────────────────────────────────

/**
 * Upload an image file to the server (which forwards to Cloudinary).
 * Returns the hosted image URL.
 */
export async function uploadImage(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{ url: string; public_id: string }> {
  const form = new FormData();
  form.append("image", file);

  const res = await api.post<ApiSuccess<{ url: string; public_id: string }>>(
    "/upload",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60_000, // uploads may take longer
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    },
  );
  return res.data.data;
}

export async function submitFeedback(data: {
  category: string;
  title: string;
  description: string;
  image_url?: string;
}): Promise<FeedbackSubmitResponse> {
  const res = await api.post<ApiSuccess<FeedbackSubmitResponse>>(
    "/feedback",
    data
  );
  return res.data.data;
}

export async function listFeedback(params: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  sort?: string;
  search?: string;
}): Promise<{ items: FeedbackItem[]; pagination: Pagination }> {
  const res = await api.get<PaginatedResponse<FeedbackItem>>("/feedback", {
    params,
  });
  return { items: res.data.data, pagination: res.data.pagination };
}

export async function getFeedback(
  trackingId: string
): Promise<FeedbackDetail> {
  const res = await api.get<ApiSuccess<FeedbackDetail>>(
    `/feedback/${trackingId}`
  );
  return res.data.data;
}

export async function upvoteFeedback(
  trackingId: string
): Promise<{ tracking_id: string; upvote_count: number }> {
  const res = await api.post<
    ApiSuccess<{ tracking_id: string; upvote_count: number }>
  >(`/feedback/${trackingId}/upvote`);
  return res.data.data;
}

export async function getPublicStats(): Promise<PublicStats> {
  const res = await api.get<ApiSuccess<PublicStats>>("/stats/public");
  return res.data.data;
}
