import { createFileRoute } from "@tanstack/react-router";
import { AccessDenied } from "@/components/access-denied";
import { DashboardLayout } from "@/components/dashboard-layout";
import { canAccess } from "@/lib/access-control";
import { useAppStore } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarRange,
  Lock,
  ShieldAlert,
  Tag,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/analytics")({
  component: () => (
    <DashboardLayout>
      <AnalyticsPage />
    </DashboardLayout>
  ),
});

const tiers = [
  { name: "Member", pct: 44, color: "bg-amber-700", count: 2128 },
  { name: "Silver", pct: 28, color: "bg-slate-400", count: 1354 },
  { name: "Gold", pct: 18, color: "bg-yellow-500", count: 870 },
  { name: "Platinum", pct: 10, color: "bg-fuchsia-500", count: 484 },
];

const promos = [
  { code: "WELCOME20", uses: 1240, revenue: 18420 },
  { code: "WASH5", uses: 980, revenue: 9700 },
  { code: "WEEKEND15", uses: 612, revenue: 11300 },
  { code: "LOYAL10", uses: 421, revenue: 6890 },
  { code: "REFER25", uses: 188, revenue: 4120 },
];

const transactions = [
  { id: "#TX-9821", customer: "John Doe", package: "Premium Foam", amount: 28, status: "Paid" },
  { id: "#TX-9820", customer: "Aiko Tanaka", package: "Express", amount: 12, status: "Paid" },
  { id: "#TX-9819", customer: "Carlos Mendes", package: "Detailing", amount: 89, status: "Paid" },
  { id: "#TX-9818", customer: "Jane Smith", package: "Premium Foam", amount: 28, status: "Refunded" },
  { id: "#TX-9817", customer: "Liam Park", package: "Express", amount: 12, status: "Paid" },
];

const maxPromo = Math.max(...promos.map((p) => p.uses));

function AnalyticsPage() {
  const { role } = useAppStore();

  if (!canAccess(role, ["Admin"])) {
    return (
      <AccessDenied
        title="Analytics are restricted"
        description="Only Admin can access executive analytics dashboards."
        role={role}
      />
    );
  }

  if (role !== "Admin") {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Analytics Restricted</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Executive dashboards are limited to Admin roles. Switch your session in the top bar.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <ShieldAlert className="h-3.5 w-3.5" /> Currently signed in as Staff
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Executive Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Weekly performance snapshot across revenue, bookings and loyalty.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs">
          <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
          May 12 - May 18, 2026
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={BadgeDollarSign} label="Total Revenue" value="$48,290" delta="+12.4%" up />
        <Kpi icon={CalendarRange} label="Active Bookings" value="342" delta="+5.1%" up />
        <Kpi icon={Tag} label="Claimed Coupons" value="3,441" delta="+18.7%" up />
        <Kpi icon={TrendingUp} label="Avg Ticket Value" value="$24.10" delta="-1.2%" up={false} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Membership Tier Demographics</h2>
            <span className="text-[11px] text-muted-foreground">4,836 members</span>
          </div>
          <p className="mb-5 text-xs text-muted-foreground">
            Concentration of active members across loyalty tiers.
          </p>

          <div className="flex h-8 w-full overflow-hidden rounded-md border border-border">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={cn("flex items-center justify-center text-[10px] font-semibold text-white", t.color)}
                style={{ width: `${t.pct}%` }}
              >
                {t.pct}%
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {tiers.map((t) => (
              <div key={t.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", t.color)} />
                    <span className="font-medium">{t.name}</span>
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {t.count.toLocaleString()} members / {t.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full", t.color)} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Promotion Efficiency</h2>
            <span className="text-[11px] text-muted-foreground">Top 5 codes</span>
          </div>
          <p className="mb-5 text-xs text-muted-foreground">
            Hover a bar for revenue impact and redemption rate.
          </p>
          <TooltipProvider delayDuration={100}>
            <div className="space-y-3">
              {promos.map((p) => (
                <div key={p.code}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-mono font-medium">{p.code}</span>
                    <span className="tabular-nums text-muted-foreground">{p.uses} uses</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all hover:bg-primary/80"
                          style={{ width: `${(p.uses / maxPromo) * 100}%` }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <div className="font-semibold">{p.code}</div>
                        <div>Redemptions: {p.uses.toLocaleString()}</div>
                        <div>Revenue impact: ${p.revenue.toLocaleString()}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
          <h2 className="text-sm font-semibold">Recent Transactions</h2>
          <span className="text-[11px] text-muted-foreground">Last 5 entries</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-background text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Txn</th>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Package</th>
              <th className="px-4 py-2 font-medium">Amount</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-mono text-xs">{t.id}</td>
                <td className="px-4 py-2.5 text-xs font-medium">{t.customer}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.package}</td>
                <td className="px-4 py-2.5 text-xs tabular-nums">${t.amount.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-xs">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      t.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
                    )}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  up,
}: {
  icon: typeof BadgeDollarSign;
  label: string;
  value: string;
  delta: string;
  up: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
            up
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
          )}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}
