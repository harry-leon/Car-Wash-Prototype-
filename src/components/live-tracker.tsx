import { Check, Clock, CheckCircle2, Car, ReceiptText, XCircle } from "lucide-react";
import { BookingStatus, STATUS_STYLES, fmtBookingMoney, useBookings } from "@/lib/booking-store";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEPS: { key: BookingStatus; label: string; desc: string; Icon: any }[] = [
  { key: "Pending", label: "Pending", desc: "Awaiting approval", Icon: Clock },
  { key: "Confirmed", label: "Confirmed", desc: "Slot secured", Icon: CheckCircle2 },
  { key: "Checked-in", label: "Checked-in", desc: "Vehicle arrived", Icon: Car },
  { key: "Completed", label: "Completed", desc: "Checkout completed", Icon: ReceiptText },
];

export function LiveTracker() {
  const { bookings, transactions, selectedBookingId, setSelectedBookingId } = useBookings();
  const booking = bookings.find((item) => item.id === selectedBookingId) ?? bookings[0];

  if (!booking) {
    return <Card className="p-12 text-center text-muted-foreground">No bookings to track.</Card>;
  }

  const activeIdx = Math.max(STEPS.findIndex((step) => step.key === booking.status), 0);
  const isCancelled = booking.status === "Cancelled";
  const transaction =
    transactions.find((item) => item.id === booking.checkoutTransactionId) ??
    transactions.find((item) => item.bookingId === booking.id) ??
    null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Now tracking</div>
            <div className="mt-1 text-2xl font-bold">Booking #{booking.id}</div>
            <div className="text-sm text-muted-foreground">
              {booking.vehicleName} / {booking.vehiclePlate} / {booking.scheduledAt}
            </div>
          </div>
          <div className="min-w-[220px]">
            <Select value={booking.id} onValueChange={setSelectedBookingId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bookings.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    #{item.id} / {item.vehiclePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        {isCancelled ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <XCircle className="h-8 w-8 text-rose-600" />
            </div>
            <div className="text-xl font-bold">Booking Cancelled</div>
            <div className="text-sm text-muted-foreground">This booking has been cancelled.</div>
            <span className={`mt-2 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES.Cancelled}`}>
              Cancelled
            </span>
          </div>
        ) : (
          <>
            <div className="relative hidden items-start justify-between md:flex">
              <div className="absolute left-[8%] right-[8%] top-7 h-1 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                  style={{ width: `${(activeIdx / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              {STEPS.map((step, index) => {
                const done = index < activeIdx;
                const active = index === activeIdx;
                const Icon = step.Icon;
                return (
                  <div key={step.key} className="relative z-10 flex flex-1 flex-col items-center text-center">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-4 transition-all duration-500 ${
                        done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : active
                            ? "scale-110 border-primary bg-primary text-primary-foreground shadow-lg"
                            : "border-muted bg-background text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <div className={`mt-3 font-semibold ${active ? "text-primary" : ""}`}>{step.label}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{step.desc}</div>
                    {active && (
                      <span className={`mt-2 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[step.key]}`}>
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 md:hidden">
              {STEPS.map((step, index) => {
                const done = index < activeIdx;
                const active = index === activeIdx;
                const Icon = step.Icon;
                return (
                  <div key={step.key} className="flex gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 ${
                        done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted bg-background text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-semibold">{step.label}</div>
                      <div className="text-xs text-muted-foreground">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      <Card className="p-6">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Booking Details</h4>
        <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Services</dt>
            <dd className="mt-0.5 font-medium">{booking.services.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Scheduled</dt>
            <dd className="mt-0.5 font-medium">{booking.scheduledAt}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Check-in Time</dt>
            <dd className="mt-0.5 font-medium">
              {booking.checkInAt ? new Date(booking.checkInAt).toLocaleString() : "Waiting"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Total</dt>
            <dd className="mt-0.5 font-medium">{fmtBookingMoney(booking.totalPrice)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Status</dt>
            <dd className="mt-0.5">
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status]}`}>
                {booking.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Wash Session</dt>
            <dd className="mt-0.5 font-medium">{booking.washStatus ?? "Not started"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Payment</dt>
            <dd className="mt-0.5 font-medium">{booking.checkoutPaymentMethod ?? "Pending"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Loyalty</dt>
            <dd className="mt-0.5 font-medium">
              +{booking.checkoutPointsEarned ?? 0} / -{booking.checkoutPointsRedeemed ?? 0}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="p-6">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Checkout & Payment</h4>
        {transaction ? (
          <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Transaction</dt>
              <dd className="mt-0.5 font-medium">{transaction.id}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Completed</dt>
              <dd className="mt-0.5 font-medium">{new Date(transaction.date).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Final Amount</dt>
              <dd className="mt-0.5 font-medium">{fmtBookingMoney(transaction.finalAmount)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Points Earned</dt>
              <dd className="mt-0.5 font-medium">+{transaction.pointsEarned}</dd>
            </div>
          </dl>
        ) : (
          <div className="text-sm text-muted-foreground">
            Checkout summary will appear here after payment is completed.
          </div>
        )}
      </Card>
    </div>
  );
}
