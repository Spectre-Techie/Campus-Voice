import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function FeedbackCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl">
      <CardHeader className="pb-3">
        {/* Category badge + status badge */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        {/* Title */}
        <Skeleton className="mt-2 h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {/* Description lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-3/4" />
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex w-full items-center justify-between">
          {/* Upvote */}
          <Skeleton className="h-8 w-16 rounded-xl" />
          {/* Date */}
          <Skeleton className="h-4 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function FeedbackGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <FeedbackCardSkeleton key={i} />
      ))}
    </div>
  );
}
