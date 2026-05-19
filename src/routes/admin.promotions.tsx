import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Tag, Power } from "lucide-react";
import { toast } from "sonner";
import { AccessDenied } from "@/components/access-denied";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { canAccess } from "@/lib/access-control";
import { useCarwashStore } from "@/lib/carwash-store";
import { cn } from "@/lib/utils";
import { useLoyalty, TierName, tierBadgeClass } from "@/lib/loyalty-store";

export const Route = createFileRoute("/admin/promotions")({
  component: () => <PromotionsPage />,
});

const ALL_TIERS: TierName[] = ["Member", "Silver", "Gold", "Platinum"];

function PromotionsPage() {
  const { role } = useCarwashStore();
  const { promotions, addPromotion, togglePromotion } = useLoyalty();

  const [code, setCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"Percentage" | "Flat">("Percentage");
  const [amount, setAmount] = React.useState(10);
  const [tiers, setTiers] = React.useState<TierName[]>(["Gold"]);
  const [startDate, setStartDate] = React.useState("2026-05-19");
  const [endDate, setEndDate] = React.useState("2026-12-31");
  const [stackable, setStackable] = React.useState(false);

  if (!canAccess(role, ["Admin"])) {
    return (
      <div className="p-6 md:p-10">
        <AccessDenied
          title="Promotions are restricted"
          description="Only Admin can manage tier-targeted promotions."
          role={role}
        />
      </div>
    );
  }

  const toggleTier = (t: TierName) =>
    setTiers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      return toast.error("Promo code is required");
    }
    if (amount <= 0) {
      return toast.error("Discount amount must be > 0");
    }
    if (tiers.length === 0) {
      return toast.error("Select at least one target tier");
    }

    addPromotion({
      code: code.toUpperCase().replace(/\s+/g, ""),
      discountType,
      amount,
      tiers,
      active: true,
      startDate,
      endDate,
      stackable,
    });
    toast.success(`Promotion ${code.toUpperCase()} launched`, {
      description: `Targeting ${tiers.join(", ")}`,
    });
    setCode("");
    setAmount(10);
    setTiers(["Gold"]);
    setStackable(false);
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Promotion & Tier Targeting</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Launch tier-exclusive promotions. Active campaigns apply automatically at checkout.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-2 rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 pb-4 border-b border-border/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Plus className="h-4 w-4" />
                </div>
                Create campaign
              </div>
              <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Promo Code</Label>
                  <Input
                    placeholder="e.g. GOLDVIP25"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="h-11 rounded-xl bg-background/50 border-border/60 font-mono text-lg transition-all focus-visible:ring-primary/30 uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Discount Type</Label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "Percentage" | "Flat")}
                      className="h-11 w-full rounded-xl border border-border/60 bg-background/50 px-3 text-sm font-semibold transition-all focus-visible:ring-primary/30"
                    >
                      <option value="Percentage">Percentage %</option>
                      <option value="Flat">Flat VND</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</Label>
                    <Input
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="h-11 rounded-xl bg-background/50 border-border/60 font-semibold transition-all focus-visible:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Date</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-xl bg-background/50 border-border/60 font-semibold transition-all focus-visible:ring-primary/30" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">End Date</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 rounded-xl bg-background/50 border-border/60 font-semibold transition-all focus-visible:ring-primary/30" />
                  </div>
                </div>

                <label className="flex items-center justify-between rounded-xl border border-border/50 bg-background/30 p-4">
                  <div>
                    <div className="text-sm font-bold">Stack With Tier Discount</div>
                    <div className="text-xs text-muted-foreground">If off, checkout uses the higher discount only.</div>
                  </div>
                  <Switch checked={stackable} onCheckedChange={setStackable} className="data-[state=checked]:bg-emerald-500" />
                </label>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Tiers</Label>
                  <div className="space-y-2.5 rounded-xl border border-border/50 bg-background/30 p-4">
                    {ALL_TIERS.map((t) => (
                      <label key={t} className="flex cursor-pointer items-center gap-3 group">
                        <Checkbox checked={tiers.includes(t)} onCheckedChange={() => toggleTier(t)} className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-all" />
                        <Badge className={cn("border shadow-sm group-hover:border-primary/40 transition-colors", tierBadgeClass(t))}>{t}</Badge>
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Launch Promotion
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center justify-between p-6 sm:p-8 border-b border-border/50 bg-accent/20">
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-inner text-primary">
                    <Tag className="h-5 w-5" />
                  </div>
                  Active Promotions
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground border border-border/50 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  {promotions.filter((p) => p.active).length} live
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border/50">
                      <TableHead className="font-bold text-xs uppercase tracking-wider pl-6">Code</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider">Discount</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider">Tiers</TableHead>
                      <TableHead className="text-right font-bold text-xs uppercase tracking-wider pr-6">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/50">
                    {promotions.map((p) => (
                      <TableRow key={p.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="pl-6">
                          <span className="font-mono text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">{p.code}</span>
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          {p.discountType === "Percentage" ? (
                            <span className="text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md">-{p.amount}%</span>
                          ) : (
                            <span className="text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md">-{p.amount.toLocaleString()} VND</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {p.tiers.map((t) => (
                              <Badge key={t} className={cn("border shadow-sm text-[10px]", tierBadgeClass(t))}>
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-3">
                            <span
                              className={cn(
                                "text-[11px] font-bold uppercase tracking-wider",
                                p.active ? "text-emerald-600" : "text-muted-foreground",
                              )}
                            >
                              {p.active ? "Active" : "Paused"}
                            </span>
                            <Switch checked={p.active} onCheckedChange={() => togglePromotion(p.id)} className="data-[state=checked]:bg-emerald-500" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {promotions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-16 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/50 shadow-inner">
                              <Power className="h-8 w-8 opacity-40" />
                            </div>
                            <div className="text-sm font-medium">No promotions created yet.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
