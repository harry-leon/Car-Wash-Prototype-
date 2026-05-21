import * as React from "react";
import { Search, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerTable } from "../components/CustomerTable";
import { CustomerDetailPage } from "./CustomerDetailPage";
import { customers as customersMock } from "../mock/customers.mock";
import type { CustomerRow, CustomerTier } from "../types/customer.types";
import styles from "../styles/customers.module.css";

const TIERS: ("ALL" | CustomerTier)[] = ["ALL", "MEMBER", "SILVER", "GOLD", "DIAMOND"];

export function CustomersPage() {
  const [search, setSearch] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState<"ALL" | CustomerTier>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const filtered = React.useMemo<CustomerRow[]>(() => {
    return customersMock.filter((row) => {
      if (tierFilter !== "ALL" && row.tier !== tierFilter) return false;
      if (statusFilter !== "ALL" && row.status !== statusFilter) return false;
      if (search) {
        const needle = search.toLowerCase();
        const haystack = `${row.name} ${row.email} ${row.phone}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [search, tierFilter, statusFilter]);

  if (selectedId) {
    return <CustomerDetailPage customerId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            <Users className="h-3.5 w-3.5" /> Customers
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Customer directory
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            Browse every account, filter by tier or status, and open a profile to review activity.
          </p>
        </div>

        <Card className="border-border/50 bg-card/60 p-4 shadow-lg backdrop-blur-xl md:p-6">
          <div className={styles.searchRow}>
            <div className="min-w-[240px] flex-1 space-y-1.5">
              <Label htmlFor="customer-search" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="customer-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, email or phone"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-[160px] space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tier</Label>
              <Select value={tierFilter} onValueChange={(next) => setTierFilter(next as typeof tierFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map((tier) => (
                    <SelectItem key={tier} value={tier}>{tier === "ALL" ? "All tiers" : tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[160px] space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</Label>
              <Select value={statusFilter} onValueChange={(next) => setStatusFilter(next as typeof statusFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filtered.length}</strong> of {customersMock.length} customers
          </div>
        </Card>

        <CustomerTable rows={filtered} onOpenDetail={setSelectedId} />
      </div>
    </div>
  );
}
