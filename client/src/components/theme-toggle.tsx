"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Prevent hydration mismatch — render skeleton until mounted
  if (!mounted) {
    return (
      <div className="flex items-center rounded-full border bg-muted/50 p-0.5">
        {THEME_OPTIONS.map((opt) => (
          <div
            key={opt.value}
            className="h-7 w-7 rounded-full"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center rounded-full border bg-muted/50 p-0.5"
      role="radiogroup"
      aria-label="Theme selection"
    >
      {THEME_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;

        return (
          <Button
            key={opt.value}
            variant="ghost"
            size="icon"
            role="radio"
            aria-checked={isActive}
            aria-label={`${opt.label} theme`}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "h-7 w-7 rounded-full transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </Button>
        );
      })}
    </div>
  );
}
