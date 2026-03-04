"use client";

import SectionError from "@/components/section-error";

export default function AdminFeedbackError({
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
      title="Failed to load feedback"
      description="We couldn't load the feedback list. Please try again."
    />
  );
}
