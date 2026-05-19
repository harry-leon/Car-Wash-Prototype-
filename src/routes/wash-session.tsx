import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bike, Car, CarFront, Check, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { AccessDenied } from "@/components/access-denied";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { canAccess } from "@/lib/access-control";
import { useCarwashStore } from "@/lib/carwash-store";
import { cn } from "@/lib/utils";
import { GUEST, fmtMoney, useWashStore } from "@/lib/wash-store";

export const Route = createFileRoute("/wash-session")({
  component: WashSessionPage,
});

const VEHICLES = [
  { id: "Sedan", label: "Sedan", icon: Car },
  { id: "SUV", label: "SUV", icon: CarFront },
  { id: "Truck", label: "Truck", icon: Truck },
  { id: "Motorbike", label: "Motorbike", icon: Bike },
];

function WashSessionPage() {
  const { role } = useCarwashStore();
  const { customers, draft, setDraft } = useWashStore();
  const navigate = useNavigate();
  const [customerId, setCustomerId] = React.useState<string>(draft?.customer.id ?? customers[0]?.id ?? "guest");
  const [vehicleType, setVehicleType] = React.useState<string>(draft?.vehicleType ?? "Sedan");
  const [plate, setPlate] = React.useState<string>(draft?.plate ?? "");
  const [selectedServices, setSelectedServices] = React.useState<string[]>(
    draft?.services.map((service) => service.id) ?? [],
  );

  const serviceCatalog = [
    { id: "basic", name: "Basic Wash", price: 120000 },
    { id: "premium", name: "Premium Detail", price: 280000 },
    { id: "vacuum", name: "Interior Vacuum", price: 60000 },
    { id: "ceramic", name: "Ceramic Coating", price: 450000 },
  ];

  const customer = customers.find((item) => item.id === customerId) ?? GUEST;
  const services = serviceCatalog.filter((service) => selectedServices.includes(service.id));
  const subtotal = services.reduce((sum, service) => sum + service.price, 0);

  if (!canAccess(role, ["Staff", "Admin"])) {
    return (
      <div className="p-6 md:p-10">
        <AccessDenied
          title="Wash session access is restricted"
          description="Only Staff and Admin roles can prepare a wash session."
          role={role}
        />
      </div>
    );
  }

  const handleProceed = () => {
    if (!plate.trim() || services.length === 0) {
      toast.error("Please capture plate and service package before checkout.");
      return;
    }

    setDraft({
      bookingId: draft?.bookingId,
      customer,
      vehicleType,
      plate: plate.trim().toUpperCase(),
      services,
      walkIn: draft?.walkIn,
    });
    navigate({ to: "/checkout" });
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Wash session processing</h1>
          <p className="text-sm text-muted-foreground">
            Confirm the checked-in vehicle, selected services and session subtotal before checkout.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold tracking-tight">Customer</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block">Select customer</Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <span className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            {item.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg border border-border bg-accent/30 p-3 text-sm">
                  <div className="text-xs text-muted-foreground">Selected</div>
                  <div className="mt-1 font-medium">{customer.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {customer.tier} / {customer.points} pts
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold tracking-tight">Vehicle</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {VEHICLES.map((vehicle) => {
                  const active = vehicleType === vehicle.id;
                  const Icon = vehicle.icon;
                  return (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => setVehicleType(vehicle.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-accent/40",
                      )}
                    >
                      <Icon className={cn("h-7 w-7", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium">{vehicle.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5">
                <Label htmlFor="plate" className="mb-1.5 block">
                  License plate
                </Label>
                <Input
                  id="plate"
                  placeholder="e.g. 79A-12345"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="font-mono uppercase tracking-wider"
                />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold tracking-tight">Services</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceCatalog.map((service) => {
                  const active = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() =>
                        setSelectedServices((prev) =>
                          prev.includes(service.id)
                            ? prev.filter((id) => id !== service.id)
                            : [...prev, service.id],
                        )
                      }
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-4 text-left transition-all",
                        active
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-accent/40",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-md border",
                            active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                          )}
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{service.name}</div>
                          <div className="text-xs text-muted-foreground">Admin-configured service</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{fmtMoney(service.price)}</div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <div>
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Summary</div>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Customer" value={customer.name} />
                <Row label="Vehicle" value={vehicleType} />
                <Row label="Plate" value={plate ? plate.toUpperCase() : "-"} />
                <Row label="Services" value={String(services.length)} />
              </div>
              <div className="mt-4 space-y-1.5 border-t border-border pt-4">
                {services.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{service.name}</span>
                    <span>{fmtMoney(service.price)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Initial total</span>
                <span className="text-2xl font-semibold tracking-tight">{fmtMoney(subtotal)}</span>
              </div>
              <Button className="mt-5 w-full" size="lg" onClick={handleProceed}>
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
