import { useState } from "react";
import { Car, Clock, Eye, X } from "lucide-react";
import { Booking, STATUS_STYLES, fmtBookingMoney, useBookings } from "@/lib/booking-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function CustomerHistory({ onTrack }: { onTrack: () => void }) {
  const { bookings, transactions, updateStatus, setSelectedBookingId } = useBookings();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const upcoming = bookings.filter((booking) =>
    ["Pending", "Confirmed", "Checked-in"].includes(booking.status),
  );
  const past = bookings.filter((booking) =>
    ["Completed", "Cancelled", "No-show"].includes(booking.status),
  );
  const detailBooking = bookings.find((booking) => booking.id === detailId) ?? null;
  const detailTransaction =
    transactions.find((transaction) => transaction.id === detailBooking?.checkoutTransactionId) ??
    transactions.find((transaction) => transaction.bookingId === detailBooking?.id) ??
    null;

  const renderCard = (booking: Booking) => {
    const cancellable = booking.status === "Pending" || booking.status === "Confirmed";
    const trackable = booking.status !== "Cancelled";

    return (
      <Card key={booking.id} className="p-5 transition-all hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base">#{booking.id}</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="mt-1 text-sm">
                {booking.vehicleName} / {booking.vehiclePlate}
              </div>
              <div className="text-sm text-muted-foreground">{booking.services.join(", ")}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {booking.scheduledAt}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-3 text-right">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-bold">{fmtBookingMoney(booking.totalPrice)}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDetailId(booking.id)}>
              <Eye className="mr-1 h-4 w-4" /> View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedBookingId(booking.id);
                onTrack();
              }}
              disabled={!trackable}
            >
              Track
            </Button>
            {cancellable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelId(booking.id)}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Upcoming ({upcoming.length})
        </h3>
        <div className="space-y-3">
          {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No upcoming bookings.</p>}
          {upcoming.map(renderCard)}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          History ({past.length})
        </h3>
        <div className="space-y-3">
          {past.length === 0 && <p className="text-sm text-muted-foreground">No booking history yet.</p>}
          {past.map(renderCard)}
        </div>
      </div>

      <AlertDialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently cancel booking #{cancelId}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (!cancelId) return;

                try {
                  updateStatus(cancelId, "Cancelled");
                  toast.success(`Booking ${cancelId} cancelled`);
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Unable to cancel booking.");
                } finally {
                  setCancelId(null);
                }
              }}
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!detailId} onOpenChange={(open) => !open && setDetailId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {detailBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking #{detailBooking.id}</DialogTitle>
                <DialogDescription>
                  {detailBooking.vehicleName} / {detailBooking.vehiclePlate}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 text-sm">
                <section className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
                  <Info label="Status" value={detailBooking.status} badgeClass={STATUS_STYLES[detailBooking.status]} />
                  <Info label="Scheduled" value={detailBooking.scheduledAt} />
                  <Info label="Services" value={detailBooking.services.join(", ")} />
                  <Info label="Booking total" value={fmtBookingMoney(detailBooking.totalPrice)} />
                </section>

                <section className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
                  <Info
                    label="Check-in time"
                    value={detailBooking.checkInAt ? new Date(detailBooking.checkInAt).toLocaleString() : "Not checked in"}
                  />
                  <Info label="Wash session" value={detailBooking.washStatus ?? "Not started"} />
                  <Info
                    label="Completed at"
                    value={detailBooking.completedAt ? new Date(detailBooking.completedAt).toLocaleString() : "Not completed"}
                  />
                  <Info label="Payment method" value={detailBooking.checkoutPaymentMethod ?? "Not paid"} />
                </section>

                <section className="rounded-lg border border-border p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Checkout Summary
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Info label="Transaction" value={detailBooking.checkoutTransactionId ?? "Pending"} />
                    <Info
                      label="Final amount"
                      value={
                        typeof detailBooking.checkoutAmount === "number"
                          ? fmtBookingMoney(detailBooking.checkoutAmount)
                          : "Pending"
                      }
                    />
                    <Info label="Points redeemed" value={String(detailBooking.checkoutPointsRedeemed ?? 0)} />
                    <Info label="Points earned" value={String(detailBooking.checkoutPointsEarned ?? 0)} />
                    <Info label="Promo code" value={detailBooking.checkoutPromoCode ?? "None"} />
                  </div>
                </section>

                <section className="rounded-lg border border-border p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Payment Transaction
                  </div>
                  {detailTransaction ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Info label="Receipt ID" value={detailTransaction.id} />
                      <Info label="Paid at" value={new Date(detailTransaction.date).toLocaleString()} />
                      <Info label="Subtotal" value={fmtBookingMoney(detailTransaction.subtotal)} />
                      <Info label="Total paid" value={fmtBookingMoney(detailTransaction.finalAmount)} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No transaction recorded yet.</p>
                  )}
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({
  label,
  value,
  badgeClass,
}: {
  label: string;
  value: string;
  badgeClass?: string;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {badgeClass ? (
        <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
          {value}
        </span>
      ) : (
        <div className="mt-1 font-medium">{value}</div>
      )}
    </div>
  );
}
