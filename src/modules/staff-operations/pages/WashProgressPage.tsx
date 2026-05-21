import { CarFront, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "../components/BookingStatusBadge";
import { CompleteWashPanel } from "../components/CompleteWashPanel";
import {
  completeWashBooking,
  formatOperationDateTime,
  useOperationBookings,
} from "../mock/operations.mock";
import styles from "../styles/checkin.module.css";

export function WashProgressPage({ bookingId }: { bookingId: string }) {
  const bookings = useOperationBookings();
  const booking = bookings.find((item) => item.id === bookingId) ?? null;

  if (!booking) return null;

  const handleCompleteWash = () => {
    try {
      const updated = completeWashBooking(booking.id);
      toast.success(`${updated.bookingCode} completed. Points recorded.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete wash.");
    }
  };

  return (
    <Card className="rounded-lg border-border/50 bg-card/70 shadow-lg">
      <CardHeader className="p-5">
        <CardTitle className="flex flex-wrap items-center gap-3 text-base">
          <CarFront className="text-primary" />
          Wash progress
          <BookingStatusBadge status={booking.status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className={styles.timeline}>
            <TimelineItem title="Checked in" value={formatOperationDateTime(booking.checkinTime)} />
            <TimelineItem
              title="Estimated finish"
              value={formatOperationDateTime(booking.estimatedFinishTime)}
            />
            <TimelineItem
              title={booking.status === "COMPLETED" ? "Wash completed" : "Vehicle in wash"}
              value={
                booking.status === "COMPLETED"
                  ? formatOperationDateTime(booking.completedTime)
                  : `${booking.vehiclePlate} is being washed by ${booking.assignedStaff}`
              }
            />
            {booking.pointTransaction && (
              <TimelineItem
                title="Point transaction"
                value={`${booking.pointTransaction.id} · +${booking.pointTransaction.pointsEarned} pts`}
              />
            )}
          </div>
          <CompleteWashPanel booking={booking} onCompleteWash={handleCompleteWash} />
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ title, value }: { title: string; value: string }) {
  return (
    <div className={styles.timelineItem}>
      <span className={styles.timelineDot} />
      <div>
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <CheckCircle2 className="text-primary" />
          {title}
        </div>
        <div className="mt-1 text-sm font-medium text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}
