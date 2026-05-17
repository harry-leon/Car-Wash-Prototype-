import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Car, CarFront, Truck, Bike, Phone, User, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePortal, VEHICLE_TYPES, VehicleType } from "@/lib/portal-store";

export const Route = createFileRoute("/")({
  component: RegisterPage,
});

const TYPE_ICONS: Record<VehicleType, React.ComponentType<{ className?: string }>> = {
  Sedan: Car,
  SUV: CarFront,
  Truck: Truck,
  Motorbike: Bike,
};

function RegisterPage() {
  const { setPending, pending } = usePortal();
  const navigate = useNavigate();

  const [name, setName] = React.useState(pending?.name ?? "");
  const [countryCode, setCountryCode] = React.useState(pending?.countryCode ?? "+84");
  const [phone, setPhone] = React.useState(pending?.phone ?? "");
  const [brandModel, setBrandModel] = React.useState(pending?.vehicle.brandModel ?? "");
  const [plate, setPlate] = React.useState(pending?.vehicle.plate ?? "");
  const [type, setType] = React.useState<VehicleType>(pending?.vehicle.type ?? "Sedan");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your full name.");
    if (!/^\d{8,11}$/.test(phone.trim())) return toast.error("Phone must be 8–11 digits.");
    if (!brandModel.trim()) return toast.error("Please enter your vehicle brand & model.");
    if (plate.trim().length < 4) return toast.error("License plate looks too short.");

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setPending({
      name: name.trim(),
      phone: phone.trim(),
      countryCode,
      vehicle: { brandModel: brandModel.trim(), plate: plate.trim().toUpperCase(), type },
    });
    setSubmitting(false);
    toast.success("Verification code sent!");
    navigate({ to: "/verify" });
  };

  return (
    <div className="min-h-screen px-4 py-8 md:p-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Step 1 of 2 · Create account
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome to ShinePass</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register in under a minute to start earning loyalty points on every wash.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <div className="p-6 space-y-5">
            <div>
              <Label htmlFor="name" className="mb-1.5 block">Full name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Nguyen"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="mb-1.5 block">Phone number</Label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="+84">🇻🇳 +84</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+65">🇸🇬 +65</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="987654321"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-accent/30 p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Primary vehicle
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand" className="mb-1.5 block">Brand & model</Label>
                  <Input
                    id="brand"
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    placeholder="Toyota Vios"
                  />
                </div>
                <div>
                  <Label htmlFor="plate" className="mb-1.5 block">License plate</Label>
                  <Input
                    id="plate"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="51G-123.45"
                    className="font-mono uppercase tracking-wider"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label className="mb-2 block">Vehicle type</Label>
                <div className="grid grid-cols-4 gap-2">
                  {VEHICLE_TYPES.map((t) => {
                    const Icon = TYPE_ICONS[t];
                    const active = type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                          active
                            ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                            : "border-border hover:border-primary/40 hover:bg-accent/40",
                        )}
                      >
                        <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-xs font-medium">{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border bg-accent/20 p-5 flex justify-end">
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}