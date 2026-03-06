"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flag,
  FlagOff,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  adminListFeedback,
  adminToggleSpam,
  type AdminFeedbackItem,
  type Pagination,
} from "@/lib/admin-api";
import { useAuth } from "@/hooks/use-auth";
import { STATUS_CONFIG, CATEGORY_CONFIG, CATEGORIES, STATUSES, type Category } from "@/lib/constants";
import { toast } from "sonner";
import Link from "next/link";
import {
  AdminFeedbackTableSkeleton,
  AdminFeedbackMobileSkeleton,
} from "@/components/admin-table-skeleton";

export default function FeedbackManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { admin } = useAuth();

  const [items, setItems] = useState<AdminFeedbackItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [spamFilter, setSpamFilter] = useState<string>(searchParams.get("spam") ?? "all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page,
        limit: 15,
        sort: "newest",
      };
      if (search.trim().length >= 2) params.search = search.trim();
      if (category !== "all") params.category = category;
      if (status !== "all") params.status = status;
      if (spamFilter === "spam") params.is_spam = true;
      if (spamFilter === "not_spam") params.is_spam = false;

      const result = await adminListFeedback(params as Parameters<typeof adminListFeedback>[0]);
      setItems(result.items);
      setPagination(result.pagination);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, spamFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function handleToggleSpam(item: AdminFeedbackItem) {
    const isSpam = item.status === "spam";
    try {
      await adminToggleSpam(item.id, !isSpam);
      toast.success(isSpam ? "Unflagged as spam" : "Flagged as spam");
      fetchData();
    } catch {
      toast.error("Failed to update spam status");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Feedback Management
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review, respond to, and manage all campus feedback submissions.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search feedback…"
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="w-full xs:w-[140px]">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-full xs:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={spamFilter} onValueChange={(v) => { setSpamFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full xs:w-[120px]">
              <SelectValue placeholder="Spam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="not_spam">Not Spam</SelectItem>
              <SelectItem value="spam">Spam Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table (desktop) + Cards (mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {loading ? (
          <>
            <div className="md:hidden">
              <AdminFeedbackMobileSkeleton rows={6} />
            </div>
            <div className="hidden md:block">
              <AdminFeedbackTableSkeleton rows={8} />
            </div>
          </>
        ) : items.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
            <MessageSquare className="h-8 w-8" />
            <p>No feedback found</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="space-y-3 md:hidden">
              {items.map((item) => {
                const catConfig = CATEGORY_CONFIG[item.category as Category];
                const statusConfig = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
                return (
                  <Link
                    key={item.id}
                    href={`/admin/feedback/${item.id}`}
                    className={`block rounded-xl border bg-card p-4 transition-colors hover:bg-accent/50 ${item.status === "spam" ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {item.tracking_id}
                        </p>
                      </div>
                      <div
                        className="text-right"
                        onClick={(e) => e.preventDefault()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/feedback/${item.id}`}>
                                <Eye className="mr-2 h-4 w-4" />View Details
                              </Link>
                            </DropdownMenuItem>
                            {admin?.role !== "viewer" && (
                              <DropdownMenuItem onClick={() => handleToggleSpam(item)}>
                                {item.status === "spam" ? (
                                  <><FlagOff className="mr-2 h-4 w-4" />Unflag Spam</>
                                ) : (
                                  <><Flag className="mr-2 h-4 w-4" />Flag as Spam</>
                                )}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {catConfig && (
                        <Badge
                          variant="secondary"
                          className={`${catConfig.bgColor} ${catConfig.color} border-0 text-xs`}
                        >
                          {catConfig.label}
                        </Badge>
                      )}
                      {statusConfig && (
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${statusConfig.dotColor}`} />
                          <span className="text-xs font-medium">{statusConfig.label}</span>
                        </div>
                      )}
                      {item.status === "spam" && (
                        <Badge variant="destructive" className="text-[10px]">SPAM</Badge>
                      )}
                      <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                        {item.upvote_count} votes · {formatDate(item.created_at)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border bg-card overflow-hidden">
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
                  {items.map((item) => {
                    const catConfig = CATEGORY_CONFIG[item.category as Category];
                    const statusConfig = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
                    return (
                      <TableRow
                        key={item.id}
                        className={`cursor-pointer ${item.status === "spam" ? "opacity-50" : ""}`}
                        onClick={() => router.push(`/admin/feedback/${item.id}`)}
                      >
                        <TableCell className="font-mono text-xs">
                          {item.tracking_id}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px]">
                            <p className="truncate text-sm font-medium">
                              {item.title}
                            </p>
                            {item.status === "spam" && (
                              <Badge variant="destructive" className="mt-1 text-[10px]">
                                SPAM
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {catConfig && (
                            <Badge
                              variant="secondary"
                              className={`${catConfig.bgColor} ${catConfig.color} border-0 text-xs`}
                            >
                              {catConfig.label}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {statusConfig && (
                            <div className="flex items-center gap-1.5">
                              <div
                                className={`h-2 w-2 rounded-full ${statusConfig.dotColor}`}
                              />
                              <span className="text-xs font-medium">
                                {statusConfig.label}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          {item.upvote_count}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(item.created_at)}
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/feedback/${item.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              {admin?.role !== "viewer" && (
                                <DropdownMenuItem
                                  onClick={() => handleToggleSpam(item)}
                                >
                                  {item.status === "spam" ? (
                                    <>
                                      <FlagOff className="mr-2 h-4 w-4" />
                                      Unflag Spam
                                    </>
                                  ) : (
                                    <>
                                      <Flag className="mr-2 h-4 w-4" />
                                      Flag as Spam
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </motion.div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm tabular-nums">
              {pagination.page} / {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={!pagination.has_next}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
