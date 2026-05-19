import { createFileRoute } from "@tanstack/react-router";
import { AccessDenied } from "@/components/access-denied";
import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { canAccess } from "@/lib/access-control";
import { useAppStore, formatRelative, type NotifType } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Bell,
  CalendarCheck,
  Clock,
  Gift,
  Search,
  Send,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  component: () => (
    <DashboardLayout>
      <NotificationsPage />
    </DashboardLayout>
  ),
});

const typeMeta: Record<NotifType, { label: string; icon: typeof Bell; classes: string; dot: string }> = {
  Booking: {
    label: "Success: Booking",
    icon: CalendarCheck,
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900",
    dot: "bg-emerald-500",
  },
  Reminder: {
    label: "Alert: 1-Hour Reminder",
    icon: Clock,
    classes: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900",
    dot: "bg-indigo-500",
  },
  Loyalty: {
    label: "Warning: Points Expiry",
    icon: Gift,
    classes: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900",
    dot: "bg-amber-500",
  },
};

function NotificationsPage() {
  const { role, notifications, pushNotification } = useAppStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | NotifType>("All");

  if (!canAccess(role, ["Staff", "Admin"])) {
    return (
      <AccessDenied
        title="Notifications are restricted"
          description="Only Staff and Admin roles can access the notification center."
        role={role}
      />
    );
  }

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter !== "All" && n.type !== filter) return false;
      if (query && !`${n.title} ${n.message}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [notifications, query, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notification Management Hub</h1>
        <p className="text-sm text-muted-foreground">
          System logs of outbound customer notifications and live trigger simulator.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Feed */}
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Notification Center Feed</h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notifications…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-8 w-56 pl-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
                <Filter className="ml-1.5 h-3 w-3 text-muted-foreground" />
                {(["All", "Booking", "Reminder", "Loyalty"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded px-2 py-1 text-xs font-medium transition-colors",
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ul className="divide-y divide-border">
            {filtered.length === 0 && (
              <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                No notifications match your filters.
              </li>
            )}
            {filtered.map((n) => {
              const m = typeMeta[n.type];
              const Icon = m.icon;
              return (
                <li key={n.id} className="flex gap-4 px-4 py-4 transition-colors hover:bg-muted/40">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md border", m.classes)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", m.classes)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
                        {m.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">{n.title}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    {formatRelative(n.timestamp)}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Simulation panel */}
        <Card className="h-fit p-5">
          <div className="mb-1 flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Simulation Action Panel</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Trigger real-time notification events to test downstream channels.
          </p>
          <div className="space-y-2">
            <Button
              className="w-full justify-start gap-2"
              onClick={() =>
                pushNotification({
                  type: "Booking",
                  title: "Booking Confirmed",
                  message: `Booking #B${Math.floor(100 + Math.random() * 900)} confirmed for new customer`,
                })
              }
            >
              <CalendarCheck className="h-4 w-4" />
              Trigger Booking Confirmation
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() =>
                pushNotification({
                  type: "Reminder",
                  title: "Upcoming Wash Alert",
                  message: "Vehicle 30A-998.77 is scheduled in 1 hour",
                })
              }
            >
              <Clock className="h-4 w-4" />
              Trigger 1-Hr Reminder
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() =>
                pushNotification({
                  type: "Loyalty",
                  title: "Points Expiry Warning",
                  message: "75 points for Customer Liam Park will expire in 7 days",
                })
              }
            >
              <Gift className="h-4 w-4" />
              Trigger Points Expiry
            </Button>
          </div>
          <div className="mt-5 rounded-md border border-dashed border-border bg-muted/30 p-3 text-[11px] text-muted-foreground">
            Triggers append to the feed and surface as a toast banner in real time.
          </div>
        </Card>
      </div>
    </div>
  );
}
