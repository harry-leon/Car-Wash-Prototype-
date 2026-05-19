import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AccessDenied } from "@/components/access-denied";
import { DashboardLayout } from "@/components/dashboard-layout";
import { canAccess } from "@/lib/access-control";
import { useAppStore, formatRelative } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardList, Lock, Plus, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/points-audit")({
  component: () => (
    <DashboardLayout>
      <AuditPage />
    </DashboardLayout>
  ),
});

function AuditPage() {
  const { role, adjustments, addAdjustment } = useAppStore();

  if (!canAccess(role, ["Admin"])) {
    return (
      <AccessDenied
        title="Points audit is restricted"
        description="Only Admin can open the manual points adjustment audit log."
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
        <h1 className="mt-4 text-lg font-semibold">Admin Privileges Required</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          The Manual Points Adjustment Audit Log contains sensitive ledger data. Switch your
          session to <span className="font-medium text-foreground">Admin</span> using the role
          dropdown in the top bar.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <ShieldAlert className="h-3.5 w-3.5" />
          Currently signed in as Staff
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Points Adjustment Audit Log
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-3 w-3" /> Admin
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Immutable ledger of manual point corrections issued by authorized personnel.
          </p>
        </div>
        <AdjustDialog onSubmit={addAdjustment} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Ledger ({adjustments.length})</h2>
          </div>
          <span className="text-[11px] text-muted-foreground">Read-only · cryptographically sealed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Timestamp</th>
                <th className="px-4 py-2 font-medium">Authorized Executive</th>
                <th className="px-4 py-2 font-medium">Target Customer</th>
                <th className="px-4 py-2 font-medium">Adjustment</th>
                <th className="px-4 py-2 font-medium">System Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {adjustments.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs font-medium">
                      {a.timestamp.toLocaleDateString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {formatRelative(a.timestamp)}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-xs">{a.executive}</td>
                  <td className="px-4 py-3 align-top text-xs font-medium">{a.customer}</td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold tabular-nums",
                        a.delta > 0
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
                      )}
                    >
                      {a.delta > 0 ? "+" : ""}
                      {a.delta} pts
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                    {a.reason}
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

function AdjustDialog({
  onSubmit,
}: {
  onSubmit: (a: { executive: string; customer: string; delta: number; reason: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");

  const submit = () => {
    const n = parseInt(delta, 10);
    if (!customer || !reason || Number.isNaN(n)) return;
    onSubmit({
      executive: "Marcus Lin (Ops Manager)",
      customer,
      delta: n,
      reason,
    });
    setOpen(false);
    setCustomer("");
    setDelta("");
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Manually Adjust Points
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Points Adjustment</DialogTitle>
          <DialogDescription>
            Applies immediately to customer balance and writes an immutable ledger entry.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="customer">Target Customer</Label>
            <Input
              id="customer"
              placeholder="e.g. Jane Smith"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="delta">Adjustment (positive or negative)</Label>
            <Input
              id="delta"
              type="number"
              placeholder="e.g. 50 or -100"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reason">System Reason</Label>
            <Textarea
              id="reason"
              placeholder="Goodwill, dispute resolution, refund offset…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Record Adjustment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
