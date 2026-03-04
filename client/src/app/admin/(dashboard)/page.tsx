"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { adminGetAnalytics, type AnalyticsData } from "@/lib/admin-api";
import { STATUS_CONFIG, CATEGORY_CONFIG, type Category } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetAnalytics()
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = analytics
    ? [
        {
          label: "Total Feedback",
          value: analytics.summary.total_submissions,
          icon: MessageSquare,
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-50 dark:bg-blue-950/50",
        },
        {
          label: "Resolution Rate",
          value: `${analytics.summary.resolution_rate}%`,
          icon: CheckCircle2,
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-950/50",
        },
        {
          label: "Avg. Resolution",
          value: `${analytics.summary.average_resolution_days}d`,
          icon: Clock,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-950/50",
        },
        {
          label: "Overdue",
          value: analytics.summary.pending_over_7_days,
          icon: AlertTriangle,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-50 dark:bg-red-950/50",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back, {admin?.display_name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with campus feedback today.
        </p>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="mt-3 h-8 w-16 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                Status Distribution
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics?.status_distribution.map((item) => {
                const config =
                  STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
                const total = analytics.summary.total_submissions || 1;
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {config?.label ?? item.status}
                      </span>
                      <span className="text-muted-foreground">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${config?.dotColor ?? "bg-gray-400"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                  </div>
                );
              })}
              {!analytics && !loading && (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                By Category
              </CardTitle>
              <Link href="/admin/analytics">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {analytics?.category_breakdown.map((item) => {
                const config =
                  CATEGORY_CONFIG[item.category as Category];
                return (
                  <div
                    key={item.category}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {config && (
                        <div className={`rounded-md p-1.5 ${config.bgColor}`}>
                          <config.icon
                            className={`h-4 w-4 ${config.color}`}
                          />
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {config?.label ?? item.category}
                      </span>
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Unresolved */}
      {analytics && analytics.top_unresolved.length > 0 && (
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.5 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                Top Unresolved Feedback
              </CardTitle>
              <Link href="/admin/feedback?status=submitted">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.top_unresolved.map((fb, i) => {
                  const catConfig =
                    CATEGORY_CONFIG[fb.category as Category];
                  return (
                    <Link
                      key={fb.id}
                      href={`/admin/feedback/${fb.id}`}
                      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">
                          {fb.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fb.tracking_id} · {fb.upvote_count} upvotes
                        </p>
                      </div>
                      {catConfig && (
                        <Badge
                          variant="secondary"
                          className={`hidden sm:inline-flex shrink-0 ${catConfig.bgColor} ${catConfig.color} border-0`}
                        >
                          {catConfig.label}
                        </Badge>
                      )}
                    </Link>
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
