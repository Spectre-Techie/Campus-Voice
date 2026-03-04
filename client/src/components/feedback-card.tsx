"use client";

import Link from "next/link";
import { Clock, MessageCircle } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { UpvoteButton } from "@/components/upvote-button";
import { cn } from "@/lib/utils";
import { CATEGORY_CONFIG, type Category } from "@/lib/constants";
import type { FeedbackItem } from "@/lib/api";

interface FeedbackCardProps {
  feedback: FeedbackItem;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const categoryConfig = CATEGORY_CONFIG[feedback.category as Category];
  const CategoryIcon = categoryConfig?.icon;

  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="p-5 sm:p-6">
        {/* Top row: category + status */}
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {CategoryIcon && (
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                  categoryConfig.bgColor
                )}
              >
                <CategoryIcon
                  className={cn("h-4 w-4", categoryConfig.color)}
                />
              </div>
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {categoryConfig?.label ?? feedback.category}
            </span>
          </div>
          <StatusBadge status={feedback.status} />
        </div>

        {/* Title — clickable */}
        <Link href={`/board/${feedback.tracking_id}`} className="block">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
            {feedback.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {feedback.description}
        </p>

        {/* Bottom row: meta + upvote */}
        <div className="mt-4 flex items-center justify-between border-t pt-3.5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]">
              {feedback.tracking_id}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(feedback.created_at)}
            </span>
            {feedback.response_count > 0 && (
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {feedback.response_count}
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
    </article>
  );
}
