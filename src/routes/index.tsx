import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CarFront,
  ClipboardList,
  Gift,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Wrench,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getHomePath } from "@/lib/auth";
import { useCarwashStore } from "@/lib/carwash-store";

export const Route = createFileRoute("/")({
  component: HomeRedirectPage,
});

function HomeRedirectPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useCarwashStore();

  useEffect(() => {
    navigate({ to: isAuthenticated ? getHomePath(role) : "/login", replace: true });
  }, [isAuthenticated, navigate, role]);

  return <div className="min-h-screen bg-background" />;
}

export function OverviewPage() {
  const { customers, bookings, transactions, notifications, role } = useCarwashStore();
  const activeCustomer = customers[0];

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" /> Unified prototype ready for demo
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Carwash main flow hub</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Registration, booking, staff check-in, wash session, checkout, loyalty, notification
            and admin flows are now linked through one shared business state.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Customers" value={String(customers.length)} />
          <StatCard
            label="Active Bookings"
            value={String(
              bookings.filter(
                (item) => item.status !== "Completed" && item.status !== "Cancelled",
              ).length,
            )}
          />
          <StatCard label="Transactions" value={String(transactions.length)} />
          <StatCard label="Notifications" value={String(notifications.length)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              Main flow shortcuts
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <FlowLink
                to="/register"
                icon={UserPlus}
                title="1. Register"
                text="Create account, verify OTP and seed first vehicle."
              />
              <FlowLink
                to="/customer/bookings/new"
                icon={ClipboardList}
                title="2. Book wash"
                text="Create a booking using current customer vehicles."
              />
              <FlowLink
                to="/staff/check-in"
                icon={Wrench}
                title="3. Staff check-in"
                text="Check in booked customers or handle walk-ins."
              />
              <FlowLink
                to="/staff/wash-session"
                icon={CarFront}
                title="4. Wash session"
                text="Prepare services before checkout."
              />
              <FlowLink
                to="/staff/checkout"
                icon={ReceiptText}
                title="5. Checkout"
                text="Apply tier discount, promotion and point redemption."
              />
              <FlowLink
                to="/customer/loyalty"
                icon={Gift}
                title="6. Loyalty"
                text="View points, tier progress and reward redemption."
              />
              <FlowLink
                to="/staff/notifications"
                icon={Bell}
                title="7. Notifications"
                text="Review booking and loyalty notifications."
              />
              <FlowLink
                to="/admin/tiers"
                icon={ShieldCheck}
                title="8. Admin rules"
                text="Manage tier rules, promotions and governance screens."
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold">Current demo state</div>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Active customer</div>
                <div className="font-medium">{activeCustomer?.name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tier / points</div>
                <div className="font-medium">
                  {activeCustomer?.tier} · {activeCustomer?.points} pts
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Workspace role</div>
                <div className="font-medium">{role}</div>
              </div>
              <Button asChild className="mt-3 w-full">
                <Link to="/customer/bookings/new">
                  Continue Main Flow
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </Card>
  );
}

function FlowLink({
  to,
  icon: Icon,
  title,
  text,
}: {
  to: string;
  icon: typeof Sparkles;
  title: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-accent/20 p-4 transition-colors hover:bg-accent/40"
    >
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{text}</div>
    </Link>
  );
}
