import * as React from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AdminBookingsFilters,
  type BookingsFilterState,
} from "../components/AdminBookingsFilters";
import { AdminBookingsTable } from "../components/AdminBookingsTable";
import { adminBookings } from "../mock/bookings.mock";
import type { AdminBookingRow, BookingStatus } from "../types/dashboard.types";

const INITIAL_FILTERS: BookingsFilterState = {
  status: "ALL",
  date: "",
  customerName: "",
};
const PAGE_SIZE = 10;

export function AdminBookingsPage() {
  const [rows, setRows] = React.useState<AdminBookingRow[]>(adminBookings);
  const [filters, setFilters] = React.useState<BookingsFilterState>(INITIAL_FILTERS);
  const [pageIndex, setPageIndex] = React.useState(0);

  const filtered = React.useMemo(() => {
    return rows.filter((row) => {
      if (filters.status !== "ALL" && row.status !== filters.status) return false;
      if (filters.date && !row.scheduledTime.startsWith(filters.date)) return false;
      if (
        filters.customerName &&
        !row.customerName.toLowerCase().includes(filters.customerName.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [rows, filters]);

  React.useEffect(() => {
    setPageIndex(0);
  }, [filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  React.useEffect(() => {
    if (pageIndex >= pageCount) {
      setPageIndex(pageCount - 1);
    }
  }, [pageCount, pageIndex]);

  const pageRows = React.useMemo(
    () => filtered.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE),
    [filtered, pageIndex],
  );

  const handleChangeStatus = (id: string, next: BookingStatus) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: next } : row)),
    );
    const target = rows.find((row) => row.id === id);
    if (target) {
      toast.success(`Updated ${target.code} → ${next.replace("_", " ")}`);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            <ClipboardList className="h-3.5 w-3.5" /> Bookings
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            All bookings
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            Inspect every booking in the system, filter by status/date/customer and override status when needed.
          </p>
        </div>

        <Card className="border-border/50 bg-card/60 p-4 shadow-lg backdrop-blur-xl md:p-6">
          <AdminBookingsFilters value={filters} onChange={setFilters} />
          <div className="mt-3 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing <strong className="text-foreground">{pageRows.length}</strong> of {filtered.length} bookings
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
              <Button
                size="sm"
                variant="outline"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
                className="h-8 px-3"
              >
                Prev
              </Button>
              <span>
                Page {pageIndex + 1} / {pageCount}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={pageIndex >= pageCount - 1}
                onClick={() => setPageIndex((value) => Math.min(pageCount - 1, value + 1))}
                className="h-8 px-3"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>

        <AdminBookingsTable rows={pageRows} onChangeStatus={handleChangeStatus} />
      </div>
    </div>
  );
}
