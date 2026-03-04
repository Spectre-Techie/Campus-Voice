"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { adminGetAnalytics, type AnalyticsData } from "@/lib/admin-api";
import { STATUS_CONFIG, CATEGORY_CONFIG, type Category } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </div>
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
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-40" />
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 flex-1 rounded-full" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Failed to load analytics data.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Feedback",
      value: data.summary.total_submissions,
      icon: MessageSquare,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      label: "Resolution Rate",
      value: `${data.summary.resolution_rate}%`,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Avg. Resolution Time",
      value: `${data.summary.average_resolution_days} days`,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      label: "Overdue Items",
      value: data.summary.pending_over_7_days,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/50",
    },
  ];

  const total = data.summary.total_submissions || 1;

  return (
    <div className="space-y-8">
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Analytics
        </h1>
        <p className="mt-1 text-muted-foreground">
          Comprehensive overview of feedback metrics and trends.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUp}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                  <div className={`rounded-lg p-2 ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                Status Distribution
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {data.status_distribution.map((item) => {
                const config =
                  STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${config?.dotColor ?? "bg-gray-400"}`}
                        />
                        <span className="font-medium">
                          {config?.label ?? item.status}
                        </span>
                      </div>
                      <span className="tabular-nums text-muted-foreground">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${config?.dotColor ?? "bg-gray-400"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                Category Breakdown
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {data.category_breakdown.map((item) => {
                const config =
                  CATEGORY_CONFIG[item.category as Category];
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div
                    key={item.category}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      {config && (
                        <div
                          className={`rounded-lg p-2 ${config.bgColor}`}
                        >
                          <config.icon
                            className={`h-4 w-4 ${config.color}`}
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {config?.label ?? item.category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pct}% of total
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold tabular-nums">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Unresolved */}
      {data.top_unresolved.length > 0 && (
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Top 5 Unresolved (by Upvotes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.top_unresolved.map((fb, i) => {
                  const catConfig =
                    CATEGORY_CONFIG[fb.category as Category];
                  const daysAgo = Math.floor(
                    (Date.now() - new Date(fb.created_at).getTime()) /
                      86400000
                  );
                  return (
                    <div
                      key={fb.id}
                      className="flex items-center gap-4 rounded-lg border p-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">
                          {fb.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fb.tracking_id} · {daysAgo} days ago
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {catConfig && (
                          <Badge
                            variant="secondary"
                            className={`hidden sm:inline-flex ${catConfig.bgColor} ${catConfig.color} border-0`}
                          >
                            {catConfig.label}
                          </Badge>
                        )}
                        <Badge variant="outline" className="tabular-nums">
                          {fb.upvote_count} votes
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
