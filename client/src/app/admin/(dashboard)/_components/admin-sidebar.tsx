"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Users,
  LogOut,
  Shield,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Feedback",
    href: "/admin/feedback",
    icon: MessageSquare,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    superAdminOnly: true,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.superAdminOnly || admin?.role === "super_admin"
  );

  const initials = admin?.display_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  const roleLabel =
    admin?.role === "super_admin"
      ? "Super Admin"
      : admin?.role === "department_admin"
      ? "Dept. Admin"
      : "Viewer";

  async function handleLogout() {
    await logout();
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn(
        "flex items-center gap-3 border-b border-sidebar-border px-4 py-5",
        collapsed && "justify-center px-2"
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Shield className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold">CampusVoice</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        <TooltipProvider delayDuration={0}>
          {filteredItems.map((item) => {
            const active = isActive(item.href);
            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                {!collapsed && <span>{item.label}</span>}
                {active && (
                  <motion.div
                    layoutId="admin-sidebar-active"
                    className="absolute left-0 top-0 h-full w-0.5 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <div className="relative">{linkContent}</div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div key={item.href} className="relative">{linkContent}</div>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Footer: User info + Logout */}
      <div className={cn(
        "border-t border-sidebar-border p-3 space-y-2",
        collapsed && "px-2"
      )}>
        <div className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2",
          collapsed && "justify-center px-0"
        )}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">
                {admin?.display_name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {roleLabel}
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(
            "w-full text-muted-foreground hover:text-destructive",
            !collapsed && "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border bg-card shadow-sm md:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="relative flex-1">
          {sidebarContent}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-accent transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
