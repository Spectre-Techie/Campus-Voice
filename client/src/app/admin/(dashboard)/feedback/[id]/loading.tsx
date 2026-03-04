import { Skeleton } from "@/components/ui/skeleton";

export default function AdminFeedbackDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Skeleton className="h-9 w-24 rounded-xl" />

      {/* Title + meta */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-7 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Response form skeleton */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3 pt-2">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
