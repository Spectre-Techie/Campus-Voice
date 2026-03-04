"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackCard } from "@/components/feedback-card";
import { FeedbackGridSkeleton } from "@/components/feedback-card-skeleton";
import { FilterBar } from "@/components/filter-bar";
import { SearchBar } from "@/components/search-bar";
import { listFeedback, type FeedbackItem, type Pagination } from "@/lib/api";

export function BoardContent() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const fetchFeedback = useCallback(
    async (pageNum: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      if (!append) setFetchError(false);
      try {
        const params: Record<string, string | number> = {
          page: pageNum,
          limit: 12,
          sort,
        };
        if (search) params.search = search;
        if (category) params.category = category;
        if (status) params.status = status;

        const result = await listFeedback(params);

        if (append) {
          setItems((prev) => [...prev, ...result.items]);
        } else {
          setItems(result.items);
        }
        setPagination(result.pagination);
      } catch {
        if (!append) setFetchError(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [search, category, status, sort]
  );

  // Re-fetch when filters change (reset to page 1)
  useEffect(() => {
    setPage(1);
    fetchFeedback(1);
  }, [fetchFeedback]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeedback(nextPage, true);
  };

  const handleReset = () => {
    setSearch("");
    setCategory(null);
    setStatus(null);
    setSort("newest");
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Filters */}
      <FilterBar
        selectedCategory={category}
        selectedStatus={status}
        selectedSort={sort}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onReset={handleReset}
      />

      {/* Results count */}
      {!loading && pagination && (
        <p className="text-sm text-muted-foreground">
          {pagination.total === 0
            ? "No results found"
            : `Showing ${items.length} of ${pagination.total} result${pagination.total !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Loading skeleton */}
      {loading && <FeedbackGridSkeleton count={6} />}

      {/* Error state */}
      {!loading && fetchError && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-destructive/5 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-base font-semibold">Failed to load feedback</p>
            <p className="mt-1 text-sm text-muted-foreground">
              There was a problem connecting to the server. Please try again.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => fetchFeedback(1)}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/20 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Inbox className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">No feedback found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || category || status
                ? "Try adjusting your filters or search query."
                : "Be the first to submit feedback!"}
            </p>
          </div>
        </div>
      )}

      {/* Feed grid */}
      {!loading && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <FeedbackCard key={item.id} feedback={item} />
            ))}
          </div>

          {/* Load More */}
          {pagination?.has_next && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="min-w-[180px] rounded-xl"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
