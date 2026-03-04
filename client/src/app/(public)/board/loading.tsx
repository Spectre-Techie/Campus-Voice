import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackGridSkeleton } from "@/components/feedback-card-skeleton";

export default function BoardLoading() {
  return (
    <div className="space-y-6">
      {/* Search bar skeleton */}
      <Skeleton className="h-11 w-full rounded-xl" />

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>

      {/* Results count skeleton */}
      <Skeleton className="h-4 w-40" />

      {/* Cards grid */}
      <FeedbackGridSkeleton count={6} />
    </div>
  );
}
