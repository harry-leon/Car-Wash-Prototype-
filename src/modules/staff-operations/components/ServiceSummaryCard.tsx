import { CalendarClock, CarFront, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatOperationDateTime } from "../mock/operations.mock";
import type { OperationBooking } from "../types/operations.types";
import styles from "../styles/checkin.module.css";

export function ServiceSummaryCard({ booking }: { booking: OperationBooking }) {
  return (
    <Card className="rounded-lg border-border/50 bg-card/70 shadow-lg">
      <CardHeader className="p-5">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserRound className="text-primary" />
          Booking detail
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className={styles.detailGrid}>
          <InfoTile label="Customer" value={booking.customerName} />
          <InfoTile label="Phone" value={booking.customerPhone} />
          <InfoTile label="Vehicle plate" value={booking.vehiclePlate} plate />
          <InfoTile label="Vehicle" value={booking.vehicleModel} />
          <InfoTile label="Service package" value={booking.servicePackage} />
          <InfoTile label="Package duration" value={`${booking.packageDurationMinutes} minutes`} />
          <InfoTile label="Scheduled time" value={formatOperationDateTime(booking.scheduledAt)} />
          <InfoTile label="Assigned staff" value={booking.assignedStaff} />
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-border/50 bg-background/55 p-4">
          <CarFront className="text-primary" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Plate verification
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              Match {booking.vehiclePlate} before staff check-in.
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-border/50 bg-background/55 p-4">
          <CalendarClock className="text-primary" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Booking window
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              {formatOperationDateTime(booking.scheduledAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoTile({ label, value, plate }: { label: string; value: string; plate?: boolean }) {
  return (
    <div className={styles.infoTile}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={plate ? styles.plateValue : styles.infoValue}>{value}</div>
    </div>
  );
}
