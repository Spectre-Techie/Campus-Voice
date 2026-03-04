import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminAnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-1 h-4 w-48" />
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
              <Skeleton className="mt-1 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-40" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-36" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
