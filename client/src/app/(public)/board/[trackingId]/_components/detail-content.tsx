"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  CalendarDays,
  ImageIcon,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { StatusTimeline } from "@/components/status-timeline";
import { UpvoteButton } from "@/components/upvote-button";
import { cn } from "@/lib/utils";
import { CATEGORY_CONFIG, type Category } from "@/lib/constants";
import { getFeedback, type FeedbackDetail } from "@/lib/api";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DetailContent() {
  const params = useParams();
  const trackingId = params.trackingId as string;

  const [feedback, setFeedback] = useState<FeedbackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingId) return;

    setLoading(true);
    setError(null);

    getFeedback(trackingId)
      .then(setFeedback)
      .catch((err) => {
        const message =
          err?.response?.data?.error?.message ??
          "Feedback not found or an error occurred.";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [trackingId]);

  // Loading
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-9 w-20 rounded-xl" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error || !feedback) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-base font-semibold">{error ?? "Feedback not found"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the tracking ID and try again.
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2 rounded-xl">
          <Link href="/board">
            <ArrowLeft className="h-4 w-4" />
            Back to Board
          </Link>
        </Button>
      </div>
    );
  }

  const categoryConfig = CATEGORY_CONFIG[feedback.category as Category];
  const CategoryIcon = categoryConfig?.icon;

  return (
    <div className="space-y-6">
      {/* Spam notice */}
      {feedback.status === "spam" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-5 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            This feedback has been flagged as spam by an administrator.
          </p>
        </div>
      )}

      {/* Back navigation */}
      <Button variant="ghost" size="sm" asChild className="gap-2 rounded-lg text-muted-foreground hover:text-foreground">
        <Link href="/board">
          <ArrowLeft className="h-4 w-4" />
          Back to Board
        </Link>
      </Button>

      {/* Header card */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        {/* Top meta row */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {CategoryIcon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                categoryConfig.bgColor
              )}
            >
              <CategoryIcon
                className={cn("h-5 w-5", categoryConfig.color)}
              />
            </div>
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {categoryConfig?.label ?? feedback.category}
          </span>
          <StatusBadge status={feedback.status} />
          <span className="rounded-md bg-muted/60 px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {feedback.tracking_id}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {feedback.title}
        </h1>

        {/* Description */}
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-7">
          {feedback.description}
        </p>

        {/* Image */}
        {feedback.image_url && (
          <div className="mt-5">
            <a
              href={feedback.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ImageIcon className="h-4 w-4" />
              View Attached Image
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {/* Meta footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(feedback.created_at)}
            </span>
            {feedback.assigned_department && (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                {feedback.assigned_department}
              </span>
            )}
            {feedback.resolved_at && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Clock className="h-4 w-4" />
                Resolved {formatShortDate(feedback.resolved_at)}
              </span>
            )}
          </div>

          <UpvoteButton
            trackingId={feedback.tracking_id}
            initialCount={feedback.upvote_count}
            status={feedback.status}
          />
        </div>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Admin Responses */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-4 w-4 text-primary" />
                Admin Responses
                {feedback.responses.length > 0 && (
                  <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {feedback.responses.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.responses.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <MessageCircle className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No admin responses yet. Check back later for updates.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.responses.map((response) => (
                    <div
                      key={response.id}
                      className="rounded-xl border bg-muted/20 p-5"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {response.admin_name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold">
                          {response.admin_name}
                        </span>
                        {response.admin_department && (
                          <span className="text-xs text-muted-foreground">
                            {response.admin_department}
                          </span>
                        )}
                        {response.status_changed_to && (
                          <StatusBadge
                            status={response.status_changed_to}
                          />
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {formatShortDate(response.created_at)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {response.response_text}
                      </p>
                      {response.proof_image_url && (
                        <a
                          href={response.proof_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                        >
                          <ImageIcon className="h-3 w-3" />
                          View Proof Image
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Timeline */}
        <div>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Status History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.status_history.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No status changes yet.
                </p>
              ) : (
                <StatusTimeline
                  history={feedback.status_history}
                  currentStatus={feedback.status}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
