import { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalIcon,
  Car,
  Check,
  Droplets,
  Sparkles,
  Wind,
} from "lucide-react";
import {
  fmtBookingMoney,
  BookingStatus,
  useAvailableServices,
  useBookings,
  useCurrentVehicles,
} from "@/lib/booking-store";
import { formatDateISO } from "@/lib/carwash-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const ICONS: Record<string, any> = { Droplets, Sparkles, Wind };
const SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];
const FULL_SLOTS = new Set(["10:00 AM", "03:00 PM"]);
const ACTIVE_STATUSES: BookingStatus[] = ["Pending", "Confirmed", "Checked-in"];

export function CustomerBookingForm({ onBooked }: { onBooked: () => void }) {
  const { addBooking, bookings } = useBookings();
  const vehicles = useCurrentVehicles();
  const services = useAvailableServices();
  const [mounted, setMounted] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [serviceIds, setServiceIds] = useState<string[]>(services[0] ? [services[0].id] : []);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slot, setSlot] = useState<string>("09:00 AM");

  const vehicle = vehicles.find((item) => item.id === vehicleId) ?? vehicles[0];
  const selectedServices = services.filter((item) => serviceIds.includes(item.id));
  const dateISO = date ? formatDateISO(date) : "";
  const total = useMemo(
    () => selectedServices.reduce((sum, service) => sum + service.price, 0),
    [selectedServices],
  );
  const blockedSlots = useMemo(() => {
    const counts = new Map<string, number>();
    const blocked = new Set<string>(FULL_SLOTS);

    bookings
      .filter((booking) => booking.dateISO === dateISO && ACTIVE_STATUSES.includes(booking.status))
      .forEach((booking) => {
        counts.set(booking.scheduledAt.split(" ").slice(-2).join(" "), (counts.get(booking.scheduledAt.split(" ").slice(-2).join(" ")) ?? 0) + 1);
        if (vehicle && booking.vehiclePlate === vehicle.plate) {
          blocked.add(booking.scheduledAt.split(" ").slice(-2).join(" "));
        }
      });

    for (const [timeSlot, count] of counts.entries()) {
      if (count >= 3) blocked.add(timeSlot);
    }

    return blocked;
  }, [bookings, dateISO, vehicle]);
  const firstAvailableSlot = SLOTS.find((item) => !blockedSlots.has(item)) ?? "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (slot && !blockedSlots.has(slot)) return;
    if (firstAvailableSlot && slot !== firstAvailableSlot) {
      setSlot(firstAvailableSlot);
    }
  }, [blockedSlots, firstAvailableSlot, slot]);

  const toggleService = (id: string) =>
    setServiceIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const confirm = () => {
    if (!vehicle || !date || !slot || serviceIds.length === 0) {
      toast.error("Please complete all booking fields.");
      return;
    }

    const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    try {
      const id = addBooking({
        vehiclePlate: vehicle.plate,
        vehicleName: vehicle.name,
        vehicleType: vehicle.type,
        services: selectedServices.map((item) => item.name),
        totalPrice: total,
        scheduledAt: `${dateLabel} ${slot}`,
        dateISO,
        status: "Confirmed",
      });
      toast.success(`Booking ${id} confirmed!`);
      onBooked();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create booking.");
    }
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Loading booking options
            </h3>
            <p className="text-sm text-muted-foreground">
              Preparing available vehicles, services, and booking slots.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Summary
            </h3>
            <p className="text-sm text-muted-foreground">Loading current booking draft...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            1. Select Vehicle
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {vehicles.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setVehicleId(item.id)}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                  vehicleId === item.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                  <Car className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.type} / {item.plate}
                  </div>
                </div>
                {vehicleId === item.id && <Check className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            2. Choose Services
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {services.map((service) => {
              const Icon = ICONS[service.icon] ?? Sparkles;
              const active = serviceIds.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className="mb-2 h-6 w-6 text-primary" />
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {fmtBookingMoney(service.price)}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            3. Pick Date & Time
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <CalIcon className="h-4 w-4" /> Available time slots
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((item) => {
                  const unavailable = blockedSlots.has(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={unavailable}
                      onClick={() => setSlot(item)}
                      className={`rounded-md border py-2.5 text-sm font-medium transition-all ${
                        unavailable
                          ? "cursor-not-allowed bg-muted text-muted-foreground/50 line-through"
                          : slot === item
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-secondary"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              {!firstAvailableSlot && (
                <div className="mt-3 text-xs text-rose-600">
                  No valid slots remain for this vehicle on the selected date.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-6 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Vehicle</div>
              <div className="font-medium">
                {vehicle?.name} / {vehicle?.plate}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Scheduled</div>
              <div className="font-medium">
                {date?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                / {slot}
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="mb-2 text-xs text-muted-foreground">Services</div>
              {selectedServices.length === 0 && (
                <div className="italic text-muted-foreground">None selected</div>
              )}
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between py-1">
                  <span>{service.name}</span>
                  <span>{fmtBookingMoney(service.price)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-bold">
              <span>Total</span>
              <span>{fmtBookingMoney(total)}</span>
            </div>
          </div>
          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={confirm}
            disabled={!vehicle || !date || !slot || serviceIds.length === 0 || !firstAvailableSlot}
          >
            Confirm Booking
          </Button>
        </Card>
      </div>
    </div>
  );
}
