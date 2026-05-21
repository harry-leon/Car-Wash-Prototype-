import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Clock3, ClipboardList, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "../components/BookingStatusBadge";
import { OperationsFilters } from "../components/OperationsFilters";
import { OperationsTable } from "../components/OperationsTable";
import { filterOperationBookings, useOperationBookings } from "../mock/operations.mock";
import type { OperationFilters } from "../types/operations.types";
import styles from "../styles/operations-board.module.css";

const defaultFilters: OperationFilters = {
  status: "ALL",
  time: "ALL",
  staffId: "ALL",
};

export function OperationsBoardPage() {
  const bookings = useOperationBookings();
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState<OperationFilters>(defaultFilters);

  const visibleBookings = React.useMemo(
    () => filterOperationBookings(bookings, filters),
    [bookings, filters],
  );

  const metrics = React.useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((booking) => booking.status === "CONFIRMED").length,
      checkedIn: bookings.filter((booking) => booking.status === "CHECKED_IN").length,
      inProgress: bookings.filter((booking) => booking.status === "IN_PROGRESS").length,
      completed: bookings.filter((booking) => booking.status === "COMPLETED").length,
    }),
    [bookings],
  );

  const openBooking = (id: string) => {
    navigate({ to: "/staff/checkin/$id", params: { id } });
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className={`${styles.boardHeader} p-5 md:p-6`}>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <ClipboardList />
                Staff Operations
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Today's booking queue
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Check in arrivals and move vehicles through the wash workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <BookingStatusBadge status="CONFIRMED" />
              <BookingStatusBadge status="CHECKED_IN" />
              <BookingStatusBadge status="IN_PROGRESS" />
              <BookingStatusBadge status="COMPLETED" />
            </div>
          </div>
        </section>

        <div className={styles.metricStrip}>
          <MetricCard label="Today" value={metrics.total} icon={Clock3} />
          <MetricCard label="Confirmed" value={metrics.confirmed} icon={ClipboardList} />
          <MetricCard label="Checked in" value={metrics.checkedIn} icon={CheckCircle2} />
          <MetricCard label="In progress" value={metrics.inProgress} icon={Play} />
          <MetricCard label="Completed" value={metrics.completed} icon={CheckCircle2} />
        </div>

        <Card className="rounded-lg border-border/50 bg-card/70 shadow-lg">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-base font-bold text-foreground">Queue filters</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Showing {visibleBookings.length} of {bookings.length} bookings.
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFilters(defaultFilters)}
                  className="h-9 rounded-lg font-bold"
                >
                  Reset
                </Button>
              </div>
              <OperationsFilters filters={filters} onChange={setFilters} />
            </div>
          </CardContent>
        </Card>

        <OperationsTable bookings={visibleBookings} onOpenBooking={openBooking} />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof ClipboardList;
}) {
  return (
    <div className={styles.metricCard}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className={styles.metricValue}>{value}</div>
          <div className={styles.metricLabel}>{label}</div>
        </div>
        <Icon className="text-primary" />
      </div>
    </div>
  );
}
