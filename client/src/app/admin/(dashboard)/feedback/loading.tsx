import { Skeleton } from "@/components/ui/skeleton";
import { AdminFeedbackTableSkeleton, AdminFeedbackMobileSkeleton } from "@/components/admin-table-skeleton";

export default function AdminFeedbackLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-1 h-4 w-64" />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-56 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Mobile list */}
      <div className="md:hidden">
        <AdminFeedbackMobileSkeleton rows={6} />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <AdminFeedbackTableSkeleton rows={8} />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
