import { TimerReset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatOperationDateTime, formatOperationTime } from "../mock/operations.mock";
import type { OperationBooking } from "../types/operations.types";

export function EstimatedFinishCard({ booking }: { booking: OperationBooking }) {
  return (
    <Card className="rounded-lg border-border/50 bg-card/70 shadow-lg">
      <CardHeader className="p-5">
        <CardTitle className="flex items-center gap-2 text-base">
          <TimerReset className="text-primary" />
          Estimated finish
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {formatOperationTime(booking.estimatedFinishTime)}
        </div>
        <div className="mt-2 text-sm font-medium text-muted-foreground">
          Check-in: {formatOperationDateTime(booking.checkinTime)}
        </div>
        <div className="mt-4 rounded-lg border border-border/50 bg-background/60 p-4 text-sm font-semibold">
          Package duration: {booking.packageDurationMinutes} minutes
        </div>
      </CardContent>
    </Card>
  );
}
