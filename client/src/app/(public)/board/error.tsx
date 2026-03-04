"use client";

import SectionError from "@/components/section-error";

export default function BoardError({
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
      title="Failed to load the board"
      description="We couldn't load the feedback board. Check your connection and try again."
    />
  );
}
