"use client";

import { useState, useCallback } from "react";
import { ArrowBigUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { upvoteFeedback } from "@/lib/api";
import { toast } from "sonner";

const VOTED_KEY = "campusvoice_voted";

function getVotedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(VOTED_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function setVotedId(trackingId: string) {
  try {
    const voted = getVotedIds();
    voted.add(trackingId);
    localStorage.setItem(VOTED_KEY, JSON.stringify([...voted]));
  } catch {
    // localStorage unavailable — silent fail
  }
}

const LOCKED_STATUSES = ["resolved", "closed", "spam"];

interface UpvoteButtonProps {
  trackingId: string;
  initialCount: number;
  status?: string;
  className?: string;
}

export function UpvoteButton({
  trackingId,
  initialCount,
  status,
  className,
}: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasVoted, setHasVoted] = useState(() => getVotedIds().has(trackingId));
  const [isLoading, setIsLoading] = useState(false);

  const isLocked = status ? LOCKED_STATUSES.includes(status) : false;

  const handleUpvote = useCallback(async () => {
    if (isLocked) {
      const label =
        status === "resolved"
          ? "This feedback has been resolved."
          : status === "closed"
          ? "This feedback is closed."
          : "This feedback is marked as spam.";
      toast.info(label + " Upvoting is disabled.");
      return;
    }
    if (hasVoted || isLoading) return;

    // Optimistic update
    setCount((prev) => prev + 1);
    setHasVoted(true);
    setIsLoading(true);

    try {
      const result = await upvoteFeedback(trackingId);
      setCount(result.upvote_count);
      setVotedId(trackingId);
    } catch {
      // Rollback on failure
      setCount((prev) => prev - 1);
      setHasVoted(false);
      toast.error("Failed to upvote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [trackingId, hasVoted, isLoading]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleUpvote}
      disabled={(hasVoted || isLoading) && !isLocked}
      aria-label={
        isLocked
          ? `Upvoting disabled (${count})`
          : hasVoted
          ? `Upvoted (${count})`
          : `Upvote (${count})`
      }
      className={cn(
        "group gap-1.5 rounded-full px-3 transition-all",
        hasVoted
          ? "bg-primary/10 text-primary hover:bg-primary/10"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
        className
      )}
    >
      <ArrowBigUp
        className={cn(
          "h-4 w-4 transition-transform group-hover:scale-110",
          hasVoted && "fill-current"
        )}
      />
      <span className="text-sm font-semibold tabular-nums">{count}</span>
    </Button>
  );
}
