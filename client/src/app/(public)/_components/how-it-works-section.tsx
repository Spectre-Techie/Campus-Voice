"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Send, Hash, TrendingUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Submit Anonymously",
    description:
      "Choose a category, describe the issue, and optionally upload a photo straight from your device for context. No sign-up or login needed.",
    icon: Send,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800/40",
  },
  {
    number: "02",
    title: "Get Your Tracking ID",
    description:
      "Receive a unique ID like CV-A1B2C3D4 to monitor your submission's progress — completely anonymously.",
    icon: Hash,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-800/40",
  },
  {
    number: "03",
    title: "Community Upvotes",
    description:
      "Other students upvote issues that matter, pushing them higher in priority and visibility.",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800/40",
  },
  {
    number: "04",
    title: "Admin Responds",
    description:
      "Administration reviews, updates the status, and responds publicly with proof of action taken.",
    icon: MessageCircle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/40",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative border-t bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            From Feedback to Resolution
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Four simple steps to make your voice heard and drive real change on campus.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group relative"
            >
              {/* Connector line (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-6 translate-x-full bg-border lg:block" />
              )}

              <div
                className={cn(
                  "relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
                  step.border
                )}
              >
                {/* Step number */}
                <span className="mb-3 block text-xs font-bold tracking-widest text-muted-foreground/50">
                  STEP {step.number}
                </span>

                <div
                  className={cn(
                    "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl",
                    step.bg
                  )}
                >
                  <step.icon className={cn("h-5 w-5", step.color)} />
                </div>

                <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Button
            size="lg"
            asChild
            className="h-12 gap-2 rounded-xl px-8 text-base shadow-md shadow-primary/20"
          >
            <Link href="/submit">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
