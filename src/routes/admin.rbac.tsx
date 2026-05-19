import { createFileRoute } from "@tanstack/react-router";
import { AccessDenied } from "@/components/access-denied";
import { DashboardLayout } from "@/components/dashboard-layout";
import { canAccess } from "@/lib/access-control";
import { useAppStore } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CarFront,
  CreditCard,
  Droplets,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Timer,
} from "lucide-react";

export const Route = createFileRoute("/admin/rbac")({
  component: () => (
    <DashboardLayout>
      <RbacPage />
    </DashboardLayout>
  ),
});

function RbacPage() {
  const { role, setRole } = useAppStore();
  const isStaff = role === "Staff";

  if (!canAccess(role, ["Admin"])) {
    return (
      <AccessDenied
        title="RBAC configuration is restricted"
        description="Only Admin can inspect and manage the permission matrix."
        role={role}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Active Wash Session</h1>
          <p className="text-sm text-muted-foreground">
            Live checkout floor - surface adjusts based on the active role.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={role === "Admin" ? "default" : "outline"}
            size="sm"
            onClick={() => setRole("Admin")}
            className="gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </Button>
          <Button
            variant={role === "Staff" ? "default" : "outline"}
            size="sm"
            onClick={() => setRole("Staff")}
            className="gap-1.5"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Staff
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CarFront className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Bay 2 - In Progress</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Metric icon={Timer} label="Elapsed" value="04:21" />
            <Metric icon={Droplets} label="Package" value="Premium Foam" />
            <Metric icon={CarFront} label="Vehicle" value="51G-123.45" />
            <Metric icon={CreditCard} label="Subtotal" value="$28.00" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm">Mark Complete</Button>
            <Button size="sm" variant="secondary">
              Open Checkout
            </Button>
            <Button size="sm" variant="outline">
              Hold Session
            </Button>
          </div>
        </Card>

        {isStaff ? (
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold">Configuration Locked</h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Pricing matrix, package edits and bay settings require Admin privileges. Switch
              roles to view.
            </p>
          </Card>
        ) : (
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Admin Quick Config</h2>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "Bay capacity rules",
                "Package & add-on pricing",
                "Loyalty multiplier config",
                "Promotion eligibility matrix",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-xs"
                >
                  <span>{item}</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    Edit
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold">Permission Matrix</h2>
        <p className="text-xs text-muted-foreground">
          Live snapshot of access privileges for the current role.
        </p>
        <div className="mt-4 overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Capability</th>
                <th className="px-3 py-2 font-medium">Admin</th>
                <th className="px-3 py-2 font-medium">Staff</th>
                <th className="px-3 py-2 font-medium">Current</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Process active wash & checkout", true, true],
                ["Send manual notifications", true, true],
                ["View analytics dashboard", true, false],
                ["Manual points adjustments", true, false],
                ["Edit pricing & packages", true, false],
                ["Override system configurations", true, false],
              ].map(([capability, adminAllowed, staffAllowed]) => {
                const allowed = role === "Admin" ? adminAllowed : staffAllowed;

                return (
                  <tr key={capability as string}>
                    <td className="px-3 py-2">{capability}</td>
                    <td className="px-3 py-2 text-emerald-600">✓</td>
                    <td className="px-3 py-2">
                      {staffAllowed ? (
                        <span className="text-emerald-600">✓</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {allowed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                          Granted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          <Lock className="h-2.5 w-2.5" /> Locked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CarFront;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-base font-semibold">{value}</div>
    </div>
  );
}
