import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function AdminTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-24 font-mono" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-1 h-3 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="mx-auto h-4 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
      </TableCell>
    </TableRow>
  );
}

export function AdminFeedbackTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px]">Tracking ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[120px]">Category</TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            <TableHead className="w-[80px] text-center">Votes</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <AdminTableRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Mobile card skeleton
export function AdminFeedbackMobileSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 font-mono" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
