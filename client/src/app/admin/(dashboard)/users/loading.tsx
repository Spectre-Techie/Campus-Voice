import { Skeleton } from "@/components/ui/skeleton";
import { AdminFeedbackTableSkeleton } from "@/components/admin-table-skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-1 h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {["Username", "Display Name", "Role", "Department", "Actions"].map((h) => (
                <th key={h} className="p-4 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                <td className="p-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                <td className="p-4"><div className="flex gap-2"><Skeleton className="h-8 w-8 rounded-lg" /><Skeleton className="h-8 w-8 rounded-lg" /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
