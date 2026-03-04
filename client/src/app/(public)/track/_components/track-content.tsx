"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowRight, Loader2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFeedback } from "@/lib/api";
import { toast } from "sonner";

export function TrackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [trackingId, setTrackingId] = useState(
    searchParams.get("id") ?? ""
  );
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = trackingId.trim();
    if (!id) {
      toast.error("Please enter a tracking ID.");
      return;
    }

    setLoading(true);
    try {
      await getFeedback(id);
      router.push(`/board/${id}`);
    } catch {
      toast.error("Feedback not found. Please check the tracking ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Hash className="h-6 w-6 text-primary" />
          </div>
        </div>

        <form onSubmit={handleLookup} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g. CV-A1B2C3D4"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              className="h-12 rounded-xl pl-10 text-center font-mono text-base tracking-wider"
              autoFocus
              aria-label="Tracking ID"
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full gap-2 rounded-xl text-base"
            disabled={loading || !trackingId.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Looking up...
              </>
            ) : (
              <>
                Track Feedback
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
          Enter the tracking ID you received after submitting feedback.
          It looks like <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">CV-XXXXXXXX</code>.
        </p>
      </div>
    </div>
  );
}
