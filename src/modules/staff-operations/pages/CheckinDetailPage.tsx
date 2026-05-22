import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "../components/BookingStatusBadge";
import { CheckinPanel } from "../components/CheckinPanel";
import { EstimatedFinishCard } from "../components/EstimatedFinishCard";
import { ServiceSummaryCard } from "../components/ServiceSummaryCard";
import { StartWashPanel } from "../components/StartWashPanel";
import { useOperationActions, useOperationBookings } from "../mock/operations.mock";
import { WashProgressPage } from "./WashProgressPage";

export function CheckinDetailPage({ bookingId }: { bookingId: string }) {
  const bookings = useOperationBookings();
  const { checkInBooking, startWashBooking } = useOperationActions();
  const navigate = useNavigate();
  const booking = bookings.find((item) => item.id === bookingId) ?? null;

  if (!booking) {
    return (
      <div className="p-4 md:p-8 lg:p-10">
        <Card className="mx-auto max-w-2xl rounded-lg border-border/50 bg-card/70 shadow-lg">
          <CardHeader>
            <CardTitle>Booking not found</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              The selected operations booking is not available in the current booking list.
            </p>
            <Button
              variant="outline"
              className="w-fit rounded-lg font-bold"
              onClick={() => navigate({ to: "/staff/operations" })}
            >
              <ArrowLeft data-icon="inline-start" />
              Back to operations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCheckIn = () => {
    try {
      const updated = checkInBooking(booking.id);
      toast.success(`${updated.bookingCode} checked in.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to check in booking.");
    }
  };

  const handleStartWash = () => {
    try {
      const updated = startWashBooking(booking.id);
      toast.success(`${updated.bookingCode} is now in wash with ${updated.staffName}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start wash.");
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-3 rounded-lg px-0 font-bold text-muted-foreground hover:bg-transparent"
              onClick={() => navigate({ to: "/staff/operations" })}
            >
              <ArrowLeft data-icon="inline-start" />
              Operations board
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <ClipboardCheck />
                Check-in detail
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {booking.bookingCode}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {booking.customerName} - {booking.vehiclePlate}
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <ServiceSummaryCard booking={booking} />
            {(booking.status === "IN_PROGRESS" || booking.status === "COMPLETED") && (
              <WashProgressPage bookingId={booking.id} />
            )}
          </div>

          <div className="flex flex-col gap-4">
            <CheckinPanel booking={booking} onCheckIn={handleCheckIn} />
            {booking.checkinTime && <EstimatedFinishCard booking={booking} />}
            {booking.status === "CHECKED_IN" && (
              <StartWashPanel booking={booking} onStartWash={handleStartWash} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
