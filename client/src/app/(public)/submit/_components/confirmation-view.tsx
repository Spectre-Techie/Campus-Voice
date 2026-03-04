"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationViewProps {
  trackingId: string;
  onSubmitAnother: () => void;
}

export function ConfirmationView({
  trackingId,
  onSubmitAnother,
}: ConfirmationViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mb-8 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/40">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        Feedback Submitted!
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Your anonymous feedback has been received. Use the tracking ID below to
        monitor its progress.
      </p>

      {/* Tracking ID Card */}
      <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Your Tracking ID
        </p>
        <div className="flex items-center justify-center gap-3">
          <code className="text-2xl font-extrabold tracking-widest text-primary sm:text-3xl">
            {trackingId}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="h-10 w-10 rounded-xl"
            aria-label="Copy tracking ID"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Save this ID! It&apos;s the only way to track your submission.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild className="gap-2 rounded-xl shadow-md shadow-primary/20">
          <Link href={`/track?id=${trackingId}`}>
            Track My Feedback
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href="/board">View Feedback Board</Link>
        </Button>
        <Button variant="ghost" onClick={onSubmitAnother} className="rounded-xl">
          Submit Another
        </Button>
      </div>
    </div>
  );
}
