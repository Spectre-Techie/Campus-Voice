import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackContent } from "./_components/track-content";

export const metadata: Metadata = {
  title: "Track Feedback",
  description: "Track the status of your anonymous feedback submission.",
};

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Track Your Feedback
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Enter your tracking ID to check the current status of your submission.
        </p>
      </div>

      <Suspense fallback={null}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
