import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CarFront,
  ClipboardList,
  Gift,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { getHomePath } from "@/lib/auth";
import { type Role, useCarwashStore } from "@/lib/carwash-store";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const CUSTOMER_NAV: NavGroup[] = [
  {
    label: "Customer",
    items: [
      { to: "/customer/overview", label: "Overview", icon: LayoutDashboard, exact: true },
      { to: "/customer/profile", label: "Profile", icon: UserRound },
      { to: "/customer/vehicles", label: "Vehicles", icon: CarFront },
      { to: "/customer/bookings/new", label: "New Booking", icon: ClipboardList },
      { to: "/customer/bookings", label: "Bookings", icon: ClipboardList },
      { to: "/customer/loyalty", label: "Loyalty", icon: Gift },
      { to: "/customer/transactions", label: "Transactions", icon: ReceiptText },
    ],
  },
];

const STAFF_NAV: NavGroup[] = [
  {
    label: "Staff",
    items: [
      { to: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/staff/check-in", label: "Check-in", icon: Wrench },
      { to: "/staff/wash-session", label: "Wash Session", icon: CarFront },
      { to: "/staff/checkout", label: "Checkout", icon: ReceiptText },
      { to: "/staff/notifications", label: "Notifications", icon: Bell },
    ],
  },
];

const ADMIN_NAV: NavGroup[] = [
  {
    label: "Admin",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
      { to: "/admin/tiers", label: "Tier Rules", icon: Settings2 },
      { to: "/admin/promotions", label: "Promotions", icon: Sparkles },
      { to: "/admin/tier-history", label: "Tier History", icon: ShieldCheck },
      { to: "/admin/points-audit", label: "Points Audit", icon: ShieldCheck },
      { to: "/admin/rbac", label: "RBAC", icon: ShieldCheck },
    ],
  },
];

function navForRole(role: Role) {
  if (role === "Staff") return STAFF_NAV;
  if (role === "Admin") return ADMIN_NAV;
  return CUSTOMER_NAV;
}

function roleBadge(role: Role) {
  return `${role} Workspace`;
}

export function AppShell({ role }: { role: Role }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const { loginAs, logout } = useCarwashStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navGroups = navForRole(role);

  const switchRole = (nextRole: Role) => {
    loginAs(nextRole);
    navigate({ to: getHomePath(nextRole) });
  };

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
                  <div className="font-semibold">AutoWash Pro</div>
                  <div className="text-xs text-muted-foreground">{roleBadge(role)}</div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="mt-4 rounded-xl border border-border bg-accent/30 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Demo Role Switch
              </div>
              <div className="mt-2 flex gap-1 rounded-lg bg-background p-1">
                {(["Customer", "Staff", "Admin"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => switchRole(item)}
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
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              {!sidebarCollapsed && (
                <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
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
          ))}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">AutoWash Pro</div>
              <div className="text-xs text-muted-foreground">
                Protected workspace aligned to production-style role boundaries
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-accent/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                {roleBadge(role)}
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
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
