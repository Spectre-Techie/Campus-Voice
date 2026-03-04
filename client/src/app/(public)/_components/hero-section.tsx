"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Send,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HERO_PILLS = [
  { icon: ShieldCheck, text: "100% Anonymous" },
  { icon: Eye, text: "Full Transparency" },
  { icon: TrendingUp, text: "Community-Driven" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background mesh gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-2"
          >
            {HERO_PILLS.map((pill) => (
              <span
                key={pill.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm"
              >
                <pill.icon className="h-3.5 w-3.5 text-primary" />
                {pill.text}
              </span>
            ))}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Speak Up.
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Shape Your Campus.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8"
          >
            The anonymous platform that turns student feedback into real change.
            Report issues, track progress with a unique ID, and hold your
            administration accountable&mdash;all without revealing your identity.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              asChild
              className="h-12 gap-2 rounded-xl px-8 text-base shadow-md shadow-primary/20 transition-shadow hover:shadow-lg hover:shadow-primary/30"
            >
              <Link href="/submit">
                <Send className="h-4 w-4" />
                Submit Feedback
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 gap-2 rounded-xl px-8 text-base"
            >
              <Link href="/board">
                Browse Feedback
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Social proof line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 text-sm text-muted-foreground/70"
          >
            No sign-up required &middot; Zero personal data stored &middot;
            Fully transparent process
          </motion.p>
        </div>
      </div>

      {/* Bottom gradient divider */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
