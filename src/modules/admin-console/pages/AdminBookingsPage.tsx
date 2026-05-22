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
import type { AdminBookingRow, BookingStatus } from "../types/dashboard.types";
import {
  type Booking as StoreBooking,
  type BookingStatus as StoreBookingStatus,
  useCarwashStore,
} from "@/lib/carwash-store";

const INITIAL_FILTERS: BookingsFilterState = {
  status: "ALL",
  date: "",
  customerName: "",
};
const PAGE_SIZE = 10;

const STORE_TO_DASHBOARD_STATUS: Record<StoreBookingStatus, BookingStatus> = {
  Pending: "CONFIRMED",
  Confirmed: "CONFIRMED",
  "Checked-in": "CHECKED_IN",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
  "No-show": "NO_SHOW",
};

const DASHBOARD_TO_STORE_STATUS: Record<BookingStatus, StoreBookingStatus | null> = {
  CONFIRMED: "Confirmed",
  CHECKED_IN: "Checked-in",
  IN_PROGRESS: null,
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
};

function toAdminRow(booking: StoreBooking): AdminBookingRow {
  const status: BookingStatus =
    booking.washStatus === "In Progress" && booking.status === "Checked-in"
      ? "IN_PROGRESS"
      : STORE_TO_DASHBOARD_STATUS[booking.status];

  return {
    id: booking.id,
    code: booking.id,
    customerName: booking.customerName ?? "—",
    vehiclePlate: booking.vehiclePlate,
    servicePackage: booking.services.join(", "),
    scheduledTime: booking.scheduledAt,
    status,
  };
}

export function AdminBookingsPage() {
  const { bookings, updateBookingStatus, hydrated } = useCarwashStore();
  const [filters, setFilters] = React.useState<BookingsFilterState>(INITIAL_FILTERS);
  const [pageIndex, setPageIndex] = React.useState(0);

  const rows = React.useMemo(
    () =>
      [...bookings]
        .sort(
          (a, b) =>
            new Date(`${b.dateISO} ${b.timeSlot}`).getTime() -
            new Date(`${a.dateISO} ${a.timeSlot}`).getTime(),
        )
        .map(toAdminRow),
    [bookings],
  );

  const filtered = React.useMemo(() => {
    const filterDate = filters.date;
    return rows.filter((row) => {
      if (filters.status !== "ALL" && row.status !== filters.status) return false;
      if (filterDate) {
        const original = bookings.find((booking) => booking.id === row.id);
        if (!original || original.dateISO !== filterDate) return false;
      }
      if (
        filters.customerName &&
        !row.customerName.toLowerCase().includes(filters.customerName.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [rows, filters, bookings]);

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
    const storeStatus = DASHBOARD_TO_STORE_STATUS[next];
    if (!storeStatus) {
      toast.info("In-progress is set automatically when a wash starts.");
      return;
    }
    try {
      updateBookingStatus(id, storeStatus);
      toast.success(`Updated ${id} → ${next.replace("_", " ")}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update booking.");
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
            Inspect every booking in the system, filter by status/date/customer and override status when needed. List stays in sync with the live store.
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

        {!hydrated ? (
          <Card className="border-border/50 bg-card/60 p-10 text-center text-sm text-muted-foreground backdrop-blur-xl">
            Loading bookings…
          </Card>
        ) : (
          <AdminBookingsTable rows={pageRows} onChangeStatus={handleChangeStatus} />
        )}
      </div>
    </div>
  );
}
