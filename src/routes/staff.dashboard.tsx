import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CarFront, ClipboardList, ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/staff/dashboard")({
  component: StaffDashboardHome,
});

function StaffDashboardHome() {
  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-primary">Staff Workspace</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Operations dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Move vehicles through check-in, wash preparation, checkout, and notifications.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StaffCard
            to="/staff/check-in"
            title="Check-in Queue"
            text="Process booked arrivals and walk-in customers."
            icon={ClipboardList}
          />
          <StaffCard
            to="/staff/wash-session"
            title="Wash Session"
            text="Prepare services and verify vehicle package details."
            icon={CarFront}
          />
          <StaffCard
            to="/staff/checkout"
            title="Checkout"
            text="Apply discounts, promotions, and finalize payment."
            icon={ReceiptText}
          />
          <StaffCard
            to="/staff/notifications"
            title="Notifications"
            text="Review booking, reminder, and loyalty messages."
            icon={Bell}
          />
        </div>
      </div>
    </div>
  );
}

function StaffCard({
  to,
  title,
  text,
  icon: Icon,
}: {
  to: string;
  title: string;
  text: string;
  icon: typeof ClipboardList;
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
