"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to console in development
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-muted-foreground">
            An unexpected error occurred. Please try again or return home.
          </p>
          {error?.digest && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/60">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
