import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OperationBooking } from "../types/operations.types";
import styles from "../styles/checkin.module.css";

interface StartWashPanelProps {
  booking: OperationBooking;
  onStartWash: () => void;
}

export function StartWashPanel({ booking, onStartWash }: StartWashPanelProps) {
  const canStart = booking.status === "CHECKED_IN";

  return (
    <section className={styles.panel}>
      <div className="flex flex-col gap-4">
        <div>
          <div className={styles.panelTitle}>Wash start</div>
          <p className={styles.panelText}>Move {booking.vehiclePlate} into active washing.</p>
        </div>
        {canStart ? (
          <Button onClick={onStartWash} className="h-11 rounded-lg font-bold">
            <Play data-icon="inline-start" />
            Start washing
          </Button>
        ) : (
          <div className={styles.lockedNotice}>
            Start washing is available after successful check-in.
          </div>
        )}
      </div>
    </section>
  );
}
