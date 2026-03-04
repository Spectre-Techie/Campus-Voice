"use client";

import { cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_CONFIG, type Category } from "@/lib/constants";
import { STATUSES, STATUS_CONFIG, type Status } from "@/lib/constants";
import { SORT_OPTIONS } from "@/lib/constants";
import { SlidersHorizontal, ArrowUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  selectedCategory: string | null;
  selectedStatus: string | null;
  selectedSort: string;
  onCategoryChange: (category: string | null) => void;
  onStatusChange: (status: string | null) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export function FilterBar({
  selectedCategory,
  selectedStatus,
  selectedSort,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onReset,
}: FilterBarProps) {
  const hasFilters =
    selectedCategory !== null ||
    selectedStatus !== null ||
    selectedSort !== "newest";

  return (
    <div className="space-y-4">
      {/* Category chips */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Category
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              selectedCategory === null
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() =>
                  onCategoryChange(isActive ? null : cat)
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-3 w-3" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status chips */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Status
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange(null)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              selectedStatus === null
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            All
          </button>
          {STATUSES.map((status) => {
            const config = STATUS_CONFIG[status];
            const isActive = selectedStatus === status;

            return (
              <button
                key={status}
                onClick={() =>
                  onStatusChange(isActive ? null : status)
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)}
                  aria-hidden
                />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort + Reset row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex gap-1.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  selectedSort === opt.value
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 gap-1.5 text-xs text-muted-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
