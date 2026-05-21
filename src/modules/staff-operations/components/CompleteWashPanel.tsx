import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatOperationDateTime } from "../mock/operations.mock";
import type { OperationBooking } from "../types/operations.types";
import styles from "../styles/checkin.module.css";

interface CompleteWashPanelProps {
  booking: OperationBooking;
  onCompleteWash: () => void;
}

export function CompleteWashPanel({ booking, onCompleteWash }: CompleteWashPanelProps) {
  const canComplete = booking.status === "IN_PROGRESS";

  return (
    <section className={styles.panel}>
      <div className="flex flex-col gap-4">
        <div>
          <div className={styles.panelTitle}>Complete wash</div>
          <p className={styles.panelText}>Finish the wash session for {booking.vehiclePlate}.</p>
        </div>
        {canComplete && (
          <Button onClick={onCompleteWash} className="h-11 rounded-lg font-bold">
            <CheckCheck data-icon="inline-start" />
            Complete wash
          </Button>
        )}
        {booking.status === "COMPLETED" && (
          <div className={styles.lockedNotice}>
            Completed at {formatOperationDateTime(booking.completedTime)}. Point transaction{" "}
            {booking.pointTransaction?.id ?? "-"} was recorded.
          </div>
        )}
        {!canComplete && booking.status !== "COMPLETED" && (
          <div className={styles.lockedNotice}>
            Complete wash is available only for vehicles in progress.
          </div>
        )}
      </div>
    </section>
  );
}
