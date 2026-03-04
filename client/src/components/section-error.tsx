"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface SectionErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

export default function SectionError({
  error,
  reset,
  title = "Failed to load",
  description = "There was a problem fetching this content.",
}: SectionErrorProps) {
  useEffect(() => {
    console.error("[SectionError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-destructive/5 p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <div>
        <p className="text-base font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {error?.digest && (
          <p className="mt-1 font-mono text-xs text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={reset}>
        <RefreshCw className="mr-2 h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}
