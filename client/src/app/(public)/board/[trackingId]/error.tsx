"use client";

import SectionError from "@/components/section-error";

export default function BoardDetailError({
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
      title="Failed to load submission"
      description="We couldn't load this feedback submission. It may not exist or there was a network error."
    />
  );
}
