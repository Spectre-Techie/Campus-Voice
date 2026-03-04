import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Megaphone, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Megaphone className="h-8 w-8 text-primary" />
        </div>

        {/* 404 */}
        <div>
          <p className="text-7xl font-bold tabular-nums text-primary">404</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/board">
              <Search className="mr-2 h-4 w-4" />
              Browse feedback
            </Link>
          </Button>
        </div>

        {/* Track link */}
        <p className="text-sm text-muted-foreground">
          Looking for a submission?{" "}
          <Link href="/track" className="text-primary underline-offset-4 hover:underline">
            Track it here
          </Link>
        </p>
      </div>
    </div>
  );
}
