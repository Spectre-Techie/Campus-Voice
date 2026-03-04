"use client";

import {
  EyeOff,
  Hash,
  TrendingUp,
  MessageCircle,
  BarChart3,
  ShieldCheck,
  ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: EyeOff,
    title: "Truly Anonymous",
    description:
      "No login, no cookies, no IP tracking. We don't store any data that could identify you.",
    accent: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: undefined,
  },
  {
    icon: Hash,
    title: "Unique Tracking ID",
    description:
      "Every submission gets a unique tracking ID so you can follow its progress — without revealing who you are.",
    accent: "from-violet-500/20 to-violet-600/5",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    badge: undefined,
  },
  {
    icon: TrendingUp,
    title: "Community Voting",
    description:
      "Community-driven priority. Upvote issues that matter and watch them get escalated faster.",
    accent: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: undefined,
  },
  {
    icon: MessageCircle,
    title: "Admin Responses",
    description:
      "Administration responds publicly with updates, proof of action taken, and resolution timelines.",
    accent: "from-amber-500/20 to-amber-600/5",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: undefined,
  },
  {
    icon: BarChart3,
    title: "Transparent Analytics",
    description:
      "Real-time analytics: resolution rates, response times, and category breakdowns at a glance.",
    accent: "from-cyan-500/20 to-cyan-600/5",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    badge: undefined,
  },
  {
    icon: ShieldCheck,
    title: "Full Audit Trail",
    description:
      "Every status change and admin action is logged and publicly visible. Accountability by design.",
    accent: "from-rose-500/20 to-rose-600/5",
    iconBg: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    badge: undefined,
  },
  {
    icon: ImagePlus,
    title: "Attach Proof Images",
    description:
      "Upload photos directly from your device — broken facilities, notice boards, anything visible. EXIF data is automatically stripped to protect your privacy.",
    accent: "from-fuchsia-500/20 to-fuchsia-600/5",
    iconBg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    badge: "New",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Trust &amp; Transparency
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every design decision puts student anonymity and administrative
            accountability first.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-7",
                // center last card if it's the only one in its row
                i === FEATURES.length - 1 && FEATURES.length % 3 === 1
                  ? "lg:col-start-2"
                  : ""
              )}
            >
              {/* Gradient accent on hover */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  feature.accent
                )}
              />

              <div className="relative">
                <div
                  className={cn(
                    "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                    feature.iconBg
                  )}
                >
                  <feature.icon
                    className={cn("h-5 w-5", feature.iconColor)}
                  />
                </div>
                <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
                  {feature.title}
                  {feature.badge && (
                    <span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-400">
                      {feature.badge}
                    </span>
                  )}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
