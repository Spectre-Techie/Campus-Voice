import { cn } from "@/lib/utils";
import { STATUS_CONFIG, type Status } from "@/lib/constants";
import { Circle, CheckCircle2, ArrowRightCircle } from "lucide-react";
import type { StatusHistoryEntry } from "@/lib/api";

interface StatusTimelineProps {
  history: StatusHistoryEntry[];
  currentStatus: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StatusTimeline({
  history,
  currentStatus,
}: StatusTimelineProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="space-y-0">
      {history.map((entry, index) => {
        const isLatest = index === history.length - 1;
        const isResolved = entry.status === "resolved";
        const config = STATUS_CONFIG[entry.status as Status];

        return (
          <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line connector */}
            {!isLatest && (
              <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
            )}

            {/* Status icon */}
            <div className="relative z-10 flex shrink-0">
              {isResolved ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : isLatest ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <ArrowRightCircle className="h-4 w-4 text-primary" />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Circle className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    config?.color ?? "text-foreground"
                  )}
                >
                  {config?.label ?? entry.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(entry.changed_at)}
                </span>
              </div>
              {entry.comment && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {entry.comment}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
