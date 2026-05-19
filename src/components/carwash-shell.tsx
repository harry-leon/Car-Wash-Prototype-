import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CarFront,
  ClipboardList,
  Gift,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useCarwashStore } from "@/lib/carwash-store";
import { canAccess, type AllowedRole } from "@/lib/access-control";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Customer",
    items: [
      { to: "/", label: "Overview", icon: LayoutDashboard, exact: true, allowed: ["Customer", "Admin"] as AllowedRole[] },
      { to: "/register", label: "Register", icon: UserPlus, allowed: ["Customer", "Admin"] as AllowedRole[] },
      { to: "/profile", label: "Profile", icon: UserRound, allowed: ["Customer", "Admin"] as AllowedRole[] },
      { to: "/vehicles", label: "Vehicles", icon: CarFront, allowed: ["Customer", "Admin"] as AllowedRole[] },
      { to: "/bookings/new", label: "New Booking", icon: ClipboardList, allowed: ["Customer", "Admin"] as AllowedRole[] },
      { to: "/bookings", label: "Bookings", icon: ClipboardList, allowed: ["Customer", "Admin"] as AllowedRole[] },
      { to: "/loyalty", label: "Loyalty", icon: Gift, allowed: ["Customer", "Admin"] as AllowedRole[] },
      { to: "/transactions", label: "Transactions", icon: ReceiptText, allowed: ["Customer", "Admin"] as AllowedRole[] },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/staff/check-in", label: "Staff Check-in", icon: Wrench, allowed: ["Staff", "Admin"] as AllowedRole[] },
      { to: "/wash-session", label: "Wash Session", icon: CarFront, allowed: ["Staff", "Admin"] as AllowedRole[] },
      { to: "/checkout", label: "Checkout", icon: ReceiptText, allowed: ["Staff", "Admin"] as AllowedRole[] },
      { to: "/notifications", label: "Notifications", icon: Bell, allowed: ["Staff", "Admin"] as AllowedRole[] },
    ],
  },
  {
    label: "Admin",
    items: [
      { to: "/admin/tiers", label: "Tier Rules", icon: Settings2, allowed: ["Admin"] as AllowedRole[] },
      { to: "/admin/promotions", label: "Promotions", icon: Sparkles, allowed: ["Admin"] as AllowedRole[] },
      { to: "/admin/tier-history", label: "Tier History", icon: ShieldCheck, allowed: ["Admin"] as AllowedRole[] },
      { to: "/admin/points-audit", label: "Points Audit", icon: ShieldCheck, allowed: ["Admin"] as AllowedRole[] },
      { to: "/admin/analytics", label: "Analytics", icon: LayoutDashboard, allowed: ["Admin"] as AllowedRole[] },
      { to: "/admin/rbac", label: "RBAC", icon: ShieldCheck, allowed: ["Admin"] as AllowedRole[] },
    ],
  },
];

export function CarwashShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { role, setRole } = useCarwashStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border bg-card transition-all duration-200 lg:flex lg:flex-col",
          sidebarCollapsed ? "w-20" : "w-72",
        )}
        onClick={() => {
          if (sidebarCollapsed) {
            setSidebarCollapsed(false);
          }
        }}
      >
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="font-semibold">Carwash</div>
                  <div className="text-xs text-muted-foreground">Unified Prototype</div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                sidebarCollapsed && "shrink-0",
              )}
              aria-label={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
          {!sidebarCollapsed && (
            <div className="mt-4 rounded-xl border border-border bg-accent/30 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Active workspace role
              </div>
              <div className="mt-2 flex gap-1 rounded-lg bg-background p-1">
                {(["Customer", "Staff", "Admin"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={cn(
                      "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                      role === item ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={cn("flex-1 overflow-y-auto py-4", sidebarCollapsed ? "px-2" : "px-3")}>
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => canAccess(role, item.allowed));

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="mb-5">
                {!sidebarCollapsed && (
                  <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </div>
                )}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                  const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={(event) => {
                        if (sidebarCollapsed) {
                          event.preventDefault();
                          setSidebarCollapsed(false);
                        }
                      }}
                      className={cn(
                        "flex rounded-md text-sm font-medium transition-colors",
                        sidebarCollapsed ? "justify-center px-2 py-2.5" : "items-center gap-3 px-3 py-2",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      {!sidebarCollapsed && item.label}
                    </Link>
                  );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">AutoWash Pro</div>
              <div className="text-xs text-muted-foreground">
                Main flow aligned to README and business rules
              </div>
            </div>
            <div className="rounded-full bg-accent/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              Role: {role}
            </div>
          </div>
        </header>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
