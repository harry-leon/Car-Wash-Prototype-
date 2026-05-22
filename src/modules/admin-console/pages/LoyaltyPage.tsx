import * as React from "react";
import { Gift } from "lucide-react";
import { TierRulesTable } from "../components/TierRulesTable";
import { TierHistoryTable } from "../components/TierHistoryTable";
import { PointsAuditTable } from "../components/PointsAuditTable";
import { Card } from "@/components/ui/card";
import { useCarwashStore } from "@/lib/carwash-store";
import type { TierRule } from "../mock/loyalty.mock";
import type {
  PointTransaction,
  TierHistoryItem,
} from "../types/customer.types";
import {
  ledgerEntryToPointTx,
  tierToDisplay,
} from "../lib/customer-mapping";

const TIER_PERKS: Record<string, string> = {
  Member: "Standard booking and base earning.",
  Silver: "Priority booking and 5% wash discount.",
  Gold: "Premium promotions, 10% discount, double points.",
  Platinum: "VIP support, 15% discount and exclusive campaigns.",
};

export function LoyaltyPage() {
  const {
    tiers,
    tierHistory,
    ledger,
    customers,
    hydrated,
  } = useCarwashStore();

  const tierRules: TierRule[] = React.useMemo(
    () =>
      tiers.map((rule) => ({
        tier: tierToDisplay(rule.name),
        minLifetimePoints: rule.minPoints,
        multiplier: rule.multiplier,
        bookingWindowDays: rule.bookingWindowDays,
        perks: rule.perks || TIER_PERKS[rule.name] || "—",
      })),
    [tiers],
  );

  const tierHistoryItems: TierHistoryItem[] = React.useMemo(
    () =>
      [...tierHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((entry) => ({
          id: entry.id,
          customerName: entry.customerName,
          fromTier: tierToDisplay(entry.previousTier),
          toTier: tierToDisplay(entry.newTier),
          changedAt: entry.date,
          reason: entry.trigger,
        })),
    [tierHistory],
  );

  const pointsAudit: PointTransaction[] = React.useMemo(() => {
    const customerById = new Map(customers.map((customer) => [customer.id, customer]));
    return [...ledger]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((entry) => {
        const tx = ledgerEntryToPointTx(entry);
        const customer = customerById.get(entry.customerId);
        return {
          ...tx,
          customerName: customer?.name ?? entry.customerId,
          availableAfter: customer?.points ?? 0,
          lifetimeAfter: customer?.points ?? 0,
        };
      });
  }, [ledger, customers]);

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            <Gift className="h-3.5 w-3.5" /> Loyalty
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Loyalty governance
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            Inspect tier thresholds, track tier promotion history and audit every loyalty point movement. All numbers reflect the live store.
          </p>
        </div>

        {!hydrated ? (
          <Card className="border-border/50 bg-card/60 p-10 text-center text-sm text-muted-foreground backdrop-blur-xl">
            Loading loyalty data…
          </Card>
        ) : (
          <>
            <TierRulesTable rules={tierRules} />
            <TierHistoryTable history={tierHistoryItems} />
            <PointsAuditTable rows={pointsAudit} />
          </>
        )}
      </div>
    </div>
  );
}
