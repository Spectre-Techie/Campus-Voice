"use client";

import SectionError from "@/components/section-error";

export default function AdminUsersError({
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
      title="Failed to load users"
      description="We couldn't load the user list. Please try again."
    />
  );
}
