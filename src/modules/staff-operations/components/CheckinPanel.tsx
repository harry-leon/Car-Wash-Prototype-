import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { OperationBooking } from "../types/operations.types";
import styles from "../styles/checkin.module.css";

interface CheckinPanelProps {
  booking: OperationBooking;
  onCheckIn: () => void;
}

export function CheckinPanel({ booking, onCheckIn }: CheckinPanelProps) {
  const [plateVerified, setPlateVerified] = React.useState(false);
  const canCheckIn = booking.status === "CONFIRMED";

  return (
    <section className={styles.panel}>
      <div className="flex flex-col gap-4">
        <div>
          <div className={styles.panelTitle}>Check-in</div>
          <p className={styles.panelText}>Confirm arrival for booking {booking.bookingCode}.</p>
        </div>

        {canCheckIn ? (
          <>
            <label className={styles.plateCheck}>
              <Checkbox
                checked={plateVerified}
                onCheckedChange={(value) => setPlateVerified(value === true)}
              />
              <span className="text-sm font-bold text-foreground">
                Plate {booking.vehiclePlate} verified
              </span>
            </label>
            <Button
              onClick={onCheckIn}
              disabled={!plateVerified}
              className="h-11 rounded-lg font-bold"
            >
              <CheckCircle2 data-icon="inline-start" />
              Check-in
            </Button>
          </>
        ) : (
          <div className={styles.lockedNotice}>
            Check-in is only available for confirmed bookings.
          </div>
        )}
      </div>
    </section>
  );
}
