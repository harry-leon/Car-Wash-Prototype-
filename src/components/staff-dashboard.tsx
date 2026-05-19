import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Car, CheckCircle2, Search, UserPlus } from "lucide-react";
import {
  fmtBookingMoney,
  STATUS_STYLES,
  useAvailableServices,
  useBookings,
} from "@/lib/booking-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCarwashStore } from "@/lib/carwash-store";
import { toast } from "sonner";

export function StaffDashboard() {
  const { bookings } = useBookings();
  const { prepareSessionForBooking, createWalkInBooking } = useCarwashStore();
  const servicesCatalog = useAvailableServices();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);
  const filtered = bookings.filter(
    (booking) =>
      (booking.status === "Confirmed" || booking.status === "Pending") &&
      (booking.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
        booking.id.toLowerCase().includes(search.toLowerCase())),
  );

  const [plate, setPlate] = useState("");
  const [vType, setVType] = useState<"Sedan" | "SUV">("Sedan");
  const [serviceIds, setServiceIds] = useState<string[]>(
    servicesCatalog[0] ? [servicesCatalog[0].id] : [],
  );

  const submitWalkIn = () => {
    if (submittingWalkIn) return;
    if (!plate.trim()) {
      toast.error("License plate required");
      return;
    }
    if (serviceIds.length === 0) {
      toast.error("Select at least one service");
      return;
    }

    try {
      setSubmittingWalkIn(true);
      const id = createWalkInBooking({ plate, vehicleType: vType, serviceIds });
      toast.success(`Walk-in ${id} checked in!`);
      setPlate("");
      setServiceIds(servicesCatalog[0] ? [servicesCatalog[0].id] : []);
      navigate({ to: "/wash-session" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create walk-in booking.");
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  return (
    <Tabs defaultValue="arrivals" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="arrivals">Pre-booked Arrivals</TabsTrigger>
        <TabsTrigger value="walkin">Walk-in Registration</TabsTrigger>
      </TabsList>

      <TabsContent value="arrivals" className="mt-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by license plate or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-4 font-medium">Booking</th>
                <th className="p-4 font-medium">Vehicle</th>
                <th className="p-4 font-medium">Services</th>
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No matching bookings.
                  </td>
                </tr>
              )}
              {filtered.map((booking) => (
                <tr key={booking.id} className="border-t transition-colors hover:bg-muted/30">
                  <td className="p-4 font-mono font-semibold">#{booking.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{booking.vehicleName}</div>
                        <div className="text-xs text-muted-foreground">{booking.vehiclePlate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{booking.services.join(", ")}</td>
                  <td className="p-4">{booking.scheduledAt}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      disabled={processingBookingId === booking.id}
                      onClick={() => {
                        try {
                          setProcessingBookingId(booking.id);
                          prepareSessionForBooking(booking.id);
                          toast.success(`${booking.id} checked in`);
                          navigate({ to: "/wash-session" });
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "Unable to check in booking.");
                        } finally {
                          setProcessingBookingId(null);
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" /> {processingBookingId === booking.id ? "Checking in..." : "Check-In"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </TabsContent>

      <TabsContent value="walkin" className="mt-6">
        <Card className="max-w-2xl p-6">
          <div className="mb-6 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">New Walk-in Customer</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label>License Plate</Label>
              <Input
                placeholder="e.g. 51A-999.88"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Vehicle Type</Label>
              <Select value={vType} onValueChange={(value: "Sedan" | "SUV") => setVType(value)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Services</Label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {servicesCatalog.map((service) => {
                  const active = serviceIds.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() =>
                        setServiceIds((prev) =>
                          prev.includes(service.id)
                            ? prev.filter((id) => id !== service.id)
                            : [...prev, service.id],
                        )
                      }
                      className={`rounded-md border-2 p-3 text-left text-sm transition-all ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="font-medium">{service.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {fmtBookingMoney(service.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <Button
              onClick={submitWalkIn}
              disabled={submittingWalkIn}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> {submittingWalkIn ? "Creating..." : "Create & Check-In"}
            </Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
