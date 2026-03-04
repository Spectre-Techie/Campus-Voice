"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { getPublicStats, type PublicStats } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";

function AnimatedNumber({ value, suffix = "" }: { value: number | string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const numericValue = typeof value === "number" ? value : parseInt(value, 10);

  useEffect(() => {
    if (!inView || isNaN(numericValue)) return;
    const duration = 1200;
    const steps = 40;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplay(numericValue);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, numericValue]);

  if (typeof value === "string" && isNaN(numericValue)) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {inView ? display : 0}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    getPublicStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const items = [
    {
      label: "Total Submissions",
      value: stats?.total_submissions ?? 0,
      suffix: "",
      icon: MessageSquare,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      ringColor: "ring-blue-200/50 dark:ring-blue-800/30",
    },
    {
      label: "Issues Resolved",
      value: stats?.total_resolved ?? 0,
      suffix: "",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      ringColor: "ring-emerald-200/50 dark:ring-emerald-800/30",
    },
    {
      label: "Avg. Resolution Time",
      value: stats?.average_resolution_days ?? 0,
      suffix: stats?.average_resolution_days === 1 ? " day" : " days",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      ringColor: "ring-amber-200/50 dark:ring-amber-800/30",
    },
  ];

  return (
    <section className="relative border-y bg-muted/20 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Platform Impact
          </h2>
          <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Real numbers. Real accountability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "group relative rounded-2xl border bg-card p-6 ring-1 transition-shadow hover:shadow-md sm:p-8",
                item.ringColor
              )}
            >
              <div
                className={cn(
                  "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl",
                  item.bg
                )}
              >
                <item.icon className={cn("h-6 w-6", item.color)} />
              </div>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                <AnimatedNumber
                  value={item.value}
                  suffix={item.suffix}
                />
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
