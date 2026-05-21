import { CheckCircle2, CircleSlash, Eye, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatOperationTime } from "../mock/operations.mock";
import type { OperationBooking } from "../types/operations.types";
import type { StaffBookingStatus } from "../types/status.types";
import { BookingStatusBadge } from "./BookingStatusBadge";
import styles from "../styles/operations-board.module.css";

interface OperationsTableProps {
  bookings: OperationBooking[];
  onOpenBooking: (id: string) => void;
}

export function OperationsTable({ bookings, onOpenBooking }: OperationsTableProps) {
  return (
    <div className={styles.tableShell}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/35 hover:bg-muted/35">
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Booking code
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Customer name
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Vehicle plate
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Service package
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Assigned staff
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Scheduled time
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Check-in time
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Estimated finish
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className={styles.emptyState}>
                No bookings match the selected filters.
              </TableCell>
            </TableRow>
          )}
          {bookings.map((booking) => {
            const action = actionForStatus(booking.status);
            const Icon = action.icon;
            return (
              <TableRow key={booking.id}>
                <TableCell className="px-4 py-4">
                  <span className={styles.bookingCode}>{booking.bookingCode}</span>
                </TableCell>
                <TableCell className="px-4 py-4 font-semibold">
                  <div>{booking.customerName}</div>
                  <div className={styles.mutedCell}>{booking.customerPhone}</div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="font-mono font-bold text-primary">{booking.vehiclePlate}</div>
                  <div className={styles.mutedCell}>{booking.vehicleModel}</div>
                </TableCell>
                <TableCell className="max-w-[230px] px-4 py-4">
                  <div className="font-semibold leading-snug">{booking.servicePackage}</div>
                  <div className={styles.mutedCell}>{booking.packageDurationMinutes} minutes</div>
                </TableCell>
                <TableCell className="px-4 py-4 font-semibold">{booking.assignedStaff}</TableCell>
                <TableCell className="px-4 py-4 font-semibold">
                  {formatOperationTime(booking.scheduledAt)}
                </TableCell>
                <TableCell className="px-4 py-4 font-semibold">
                  {formatOperationTime(booking.checkinTime)}
                </TableCell>
                <TableCell className="px-4 py-4 font-semibold">
                  {formatOperationTime(booking.estimatedFinishTime)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <BookingStatusBadge status={booking.status} />
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <Button
                    size="sm"
                    variant={action.variant}
                    onClick={() => onOpenBooking(booking.id)}
                    className={cn("rounded-lg font-bold", action.emphasis)}
                  >
                    <Icon data-icon="inline-start" />
                    {action.label}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function actionForStatus(status: StaffBookingStatus): {
  label: string;
  icon: typeof Eye;
  variant: "default" | "outline" | "secondary";
  emphasis?: string;
} {
  if (status === "CONFIRMED") {
    return { label: "Check-in", icon: CheckCircle2, variant: "default" };
  }

  if (status === "CHECKED_IN") {
    return { label: "Start wash", icon: Play, variant: "secondary" };
  }

  if (status === "IN_PROGRESS") {
    return { label: "View wash", icon: Eye, variant: "outline" };
  }

  if (status === "COMPLETED") {
    return { label: "View", icon: Eye, variant: "outline" };
  }

  return { label: "Closed", icon: CircleSlash, variant: "outline" };
}
