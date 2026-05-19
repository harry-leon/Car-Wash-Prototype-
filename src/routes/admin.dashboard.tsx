import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ShieldCheck, Sparkles, Tags } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-primary">Admin Workspace</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Governance dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage loyalty rules, promotions, audit trails, and executive analytics.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminCard
            to="/admin/analytics"
            title="Analytics"
            text="Monitor revenue, bookings, and promotion performance."
            icon={BarChart3}
          />
          <AdminCard
            to="/admin/tiers"
            title="Tier Rules"
            text="Configure thresholds, booking windows, and tier multipliers."
            icon={ShieldCheck}
          />
          <AdminCard
            to="/admin/promotions"
            title="Promotions"
            text="Launch or pause tier-targeted discounts and campaigns."
            icon={Sparkles}
          />
          <AdminCard
            to="/admin/points-audit"
            title="Points Audit"
            text="Review manual adjustments and loyalty balance changes."
            icon={Tags}
          />
        </div>
      </div>
    </div>
  );
}

function AdminCard({
  to,
  title,
  text,
  icon: Icon,
}: {
  to: string;
  title: string;
  text: string;
  icon: typeof BarChart3;
}) {
  return (
    <Link to={to}>
      <Card className="h-full rounded-2xl border border-border p-5 transition-colors hover:bg-accent/30">
        <Icon className="h-5 w-5 text-primary" />
        <div className="mt-4 text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">{text}</div>
      </Card>
    </Link>
  );
}
