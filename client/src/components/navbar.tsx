"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Send, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/board", label: "Feedback Board" },
  { href: "/track", label: "Track Status" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Megaphone className="h-4.5 w-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Campus<span className="text-primary">Voice</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-[1.15rem] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button asChild size="sm" className="gap-2 rounded-lg shadow-sm">
            <Link href="/submit">
              <Send className="h-3.5 w-3.5" />
              Submit Feedback
            </Link>
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "overflow-hidden border-t bg-background/95 backdrop-blur-lg transition-all duration-300 ease-in-out lg:hidden",
          mobileOpen
            ? "max-h-80 opacity-100"
            : "max-h-0 border-transparent opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-1 border-t pt-3">
            <Button asChild className="w-full gap-2 rounded-lg">
              <Link href="/submit">
                <Send className="h-3.5 w-3.5" />
                Submit Feedback
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
