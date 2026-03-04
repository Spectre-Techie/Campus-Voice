import { cn } from "@/lib/utils";
import { STATUS_CONFIG, type Status } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as Status] ?? {
    label: status,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    dotColor: "bg-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)}
        aria-hidden
      />
      {config.label}
    </span>
  );
}
