"use client";

import SectionError from "@/components/section-error";

export default function AdminFeedbackDetailError({
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
      title="Failed to load feedback detail"
      description="We couldn't load this feedback item. Please try again."
    />
  );
}
