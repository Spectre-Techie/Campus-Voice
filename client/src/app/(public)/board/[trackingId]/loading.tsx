import { Skeleton } from "@/components/ui/skeleton";

export default function BoardDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button */}
      <Skeleton className="h-9 w-28 rounded-xl" />

      {/* Header card */}
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
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3 pt-2">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
