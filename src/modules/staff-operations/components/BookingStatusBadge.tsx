import { cn } from "@/lib/utils";
import { STAFF_BOOKING_STATUS_LABELS, type StaffBookingStatus } from "../types/status.types";
import styles from "../styles/operations-board.module.css";

const statusClasses: Record<StaffBookingStatus, string> = {
  CONFIRMED: styles.statusConfirmed,
  CHECKED_IN: styles.statusCheckedIn,
  IN_PROGRESS: styles.statusInProgress,
  COMPLETED: styles.statusCompleted,
  CANCELLED: styles.statusCancelled,
  NO_SHOW: styles.statusNoShow,
};

export function BookingStatusBadge({ status }: { status: StaffBookingStatus }) {
  return (
    <span className={cn(styles.statusBadge, statusClasses[status])}>
      <span className={styles.statusDot} />
      {STAFF_BOOKING_STATUS_LABELS[status]}
    </span>
  );
}
