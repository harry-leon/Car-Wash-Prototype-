import { createFileRoute } from "@tanstack/react-router";
import {
  CarFront,
  CreditCard,
  Droplets,
  Lock,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { AccessDenied } from "@/components/access-denied";
import { Card } from "@/components/ui/card";
import { canAccess } from "@/lib/access-control";
import { useAppStore } from "@/lib/app-store";

export const Route = createFileRoute("/admin/rbac")({
  component: RbacPage,
});

function RbacPage() {
  const { role } = useAppStore();

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
          <h1 className="text-2xl font-semibold tracking-tight">Permission Matrix</h1>
          <p className="text-sm text-muted-foreground">
            Role-based capability snapshot for the protected AutoWash Pro workspace.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Demo Role Switch lives in the sidebar
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CarFront className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Operations Capability Preview</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Admin scope
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Metric icon={Timer} label="Wash floor" value="Full visibility" />
            <Metric icon={Droplets} label="Packages" value="Configurable" />
            <Metric icon={CarFront} label="Bays" value="Override rules" />
            <Metric icon={CreditCard} label="Checkout" value="Audit enabled" />
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-border bg-accent/20 p-4 text-sm text-muted-foreground">
            This page documents who can access each operational capability. To preview other
            workspaces, use the <span className="font-medium text-foreground">Demo Role Switch</span>{" "}
            in the sidebar instead of changing role inside the page.
          </div>
        </Card>

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
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  Admin only
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold">Permission Matrix</h2>
        <p className="text-xs text-muted-foreground">
          Production-style access rules for the current prototype roles.
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
              ].map(([capability, adminAllowed, staffAllowed]) => (
                <tr key={capability as string}>
                  <td className="px-3 py-2">{capability}</td>
                  <td className="px-3 py-2 text-emerald-600">Yes</td>
                  <td className="px-3 py-2">
                    {staffAllowed ? (
                      <span className="text-emerald-600">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {adminAllowed ? (
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
              ))}
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
