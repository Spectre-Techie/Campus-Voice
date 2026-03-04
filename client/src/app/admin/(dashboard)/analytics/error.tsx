"use client";

import SectionError from "@/components/section-error";

export default function AdminAnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SectionError
      error={error}
      reset={reset}
      title="Failed to load analytics"
      description="We couldn't load the analytics data. Please try again."
    />
  );
}
