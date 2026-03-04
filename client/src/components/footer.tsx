import Link from "next/link";
import { Megaphone } from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Platform",
    links: [
      { href: "/board", label: "Feedback Board" },
      { href: "/submit", label: "Submit Feedback" },
      { href: "/track", label: "Track Status" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "#", label: "How It Works" },
      { href: "#", label: "Privacy" },
      { href: "#", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Megaphone className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Campus<span className="text-primary">Voice</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The anonymous feedback platform that drives campus accountability.
              No logins, no tracking, just transparent change.
            </p>
          </div>

          {/* Nav sections */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} CampusVoice. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            All submissions are anonymous. No personal data is stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
