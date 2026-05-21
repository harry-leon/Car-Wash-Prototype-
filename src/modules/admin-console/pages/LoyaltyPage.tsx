import { Gift } from "lucide-react";
import { TierRulesTable } from "../components/TierRulesTable";
import { TierHistoryTable } from "../components/TierHistoryTable";
import { PointsAuditTable } from "../components/PointsAuditTable";
import { pointsAudit, tierHistory, tierRules } from "../mock/loyalty.mock";

export function LoyaltyPage() {
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
            Inspect tier thresholds, track tier promotion history and audit every loyalty point movement.
          </p>
        </div>

        <TierRulesTable rules={tierRules} />
        <TierHistoryTable history={tierHistory} />
        <PointsAuditTable rows={pointsAudit} />
      </div>
    </div>
  );
}
