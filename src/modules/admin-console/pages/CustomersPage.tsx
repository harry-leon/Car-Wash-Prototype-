import * as React from "react";
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useCarwashStore } from "@/lib/carwash-store";
import { CustomerTable } from "../components/CustomerTable";
import { CustomerDetailPage } from "./CustomerDetailPage";
import { storeCustomersToRows } from "../lib/customer-mapping";
import type { CustomerRow, CustomerTier } from "../types/customer.types";
import styles from "../styles/customers.module.css";

const TIERS: ("ALL" | CustomerTier)[] = ["ALL", "MEMBER", "SILVER", "GOLD", "DIAMOND"];
const PAGE_SIZE = 10;

export function CustomersPage() {
  const { customers, ledger, hydrated } = useCarwashStore();
  const [search, setSearch] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState<"ALL" | CustomerTier>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  const rows = React.useMemo<CustomerRow[]>(
    () => storeCustomersToRows(customers, ledger),
    [customers, ledger],
  );

  const filtered = React.useMemo<CustomerRow[]>(() => {
    return rows.filter((row) => {
      if (tierFilter !== "ALL" && row.tier !== tierFilter) return false;
      if (statusFilter !== "ALL" && row.status !== statusFilter) return false;
      if (search) {
        const needle = search.toLowerCase();
        const haystack = `${row.name} ${row.email} ${row.phone}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, search, tierFilter, statusFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [search, tierFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
            Browse every account, filter by tier or status, and open a profile to review activity. List stays in sync with bookings, registrations and loyalty changes across the app.
          </p>
        </div>

        <Card className="border-border/50 bg-card/60 p-4 shadow-lg backdrop-blur-xl md:p-6">
          <div className={styles.searchRow}>
            <div className="min-w-[240px] flex-1 space-y-1.5">
              <Label
                htmlFor="customer-search"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
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
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tier
              </Label>
              <Select
                value={tierFilter}
                onValueChange={(next) => setTierFilter(next as typeof tierFilter)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier === "ALL" ? "All tiers" : tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[160px] space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(next) => setStatusFilter(next as typeof statusFilter)}
              >
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
            Showing <strong className="text-foreground">{filtered.length}</strong> of {rows.length}{" "}
            customers
          </div>
        </Card>

        {!hydrated ? (
          <Card className="border-border/50 bg-card/60 p-10 text-center text-sm text-muted-foreground backdrop-blur-xl">
            Loading customers…
          </Card>
        ) : (
          <>
            <CustomerTable rows={pageRows} onOpenDetail={setSelectedId} />

            <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
              <span>
                Page <strong className="text-foreground">{safePage}</strong> of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                >
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                >
                  Next
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
