import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bike, Car, CarFront, Phone, Sparkles, Truck, User, Hash, Tag } from "lucide-react";
import { toast } from "sonner";
import { GuestLayout } from "@/components/guest-layout";
import { GuestOnly } from "@/components/route-guards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortal, VEHICLE_TYPES, VehicleType } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  component: () => <RegisterPage />,
});

const TYPE_ICONS: Record<VehicleType, React.ComponentType<{ className?: string }>> = {
  Sedan: Car,
  SUV: CarFront,
  Truck: Truck,
  Motorbike: Bike,
};

export function RegisterPage() {
  const { requestRegistrationOtp, pending } = usePortal();
  const navigate = useNavigate();
  const [name, setName] = React.useState(pending?.name ?? "");
  const [countryCode, setCountryCode] = React.useState(pending?.countryCode ?? "+84");
  const [phone, setPhone] = React.useState(pending?.phone ?? "");
  const [brandModel, setBrandModel] = React.useState(pending?.vehicle.brandModel ?? "");
  const [plate, setPlate] = React.useState(pending?.vehicle.plate ?? "");
  const [type, setType] = React.useState<VehicleType>(pending?.vehicle.type ?? "Sedan");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return toast.error("Please enter your full name.");
    if (!/^0\d{9}$/.test(phone.trim())) return toast.error("Phone must follow Vietnamese format (e.g. 0901234567).");
    if (!brandModel.trim()) return toast.error("Please enter your vehicle brand & model.");
    if (plate.trim().length < 4) return toast.error("License plate looks too short.");

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      requestRegistrationOtp({
        name: name.trim(),
        phone: phone.trim(),
        countryCode,
        vehicle: { brandModel: brandModel.trim(), plate: plate.trim().toUpperCase(), type },
      });
      toast.success("Verification code sent!");
      navigate({ to: "/verify" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send verification code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GuestOnly>
      <GuestLayout
        title="Create an account"
        description="Join AURA CAR CARE to manage your vehicles, bookings, and earn loyalty rewards."
        footer={
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in instead
            </Link>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Personal Info Section */}
            <div className="rounded-2xl border border-border/50 bg-background/30 p-5 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Personal Details</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nguyen Van A"
                    className="pl-10 h-11 bg-background/50 border-border/60 focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(event) => setCountryCode(event.target.value)}
                      className="h-11 w-20 appearance-none rounded-md border border-border/60 bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all font-medium"
                    >
                      <option value="+84">+84</option>
                    </select>
                  </div>
                  <div className="relative flex-1 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <Input
                      id="phone"
                      inputMode="numeric"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                      placeholder="0901234567"
                      className="pl-10 h-11 bg-background/50 border-border/60 focus:bg-background transition-all tracking-wide"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info Section */}
            <div className="rounded-2xl border border-border/50 bg-background/30 p-5 backdrop-blur-sm space-y-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
              
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Primary Vehicle</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium">Brand & Model</Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Tag className="h-4 w-4" />
                    </div>
                    <Input
                      id="brand"
                      value={brandModel}
                      onChange={(event) => setBrandModel(event.target.value)}
                      placeholder="Toyota Vios"
                      className="pl-10 h-11 bg-background/50 border-border/60 focus:bg-background transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plate" className="text-sm font-medium">License Plate</Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Hash className="h-4 w-4" />
                    </div>
                    <Input
                      id="plate"
                      value={plate}
                      onChange={(event) => setPlate(event.target.value)}
                      placeholder="51G-123.45"
                      className="pl-10 h-11 font-mono uppercase tracking-wider bg-background/50 border-border/60 focus:bg-background transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Label className="text-sm font-medium block mb-3">Vehicle Type</Label>
                <div className="grid grid-cols-4 gap-2">
                  {VEHICLE_TYPES.map((item) => {
                    const Icon = TYPE_ICONS[item];
                    const active = type === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setType(item)}
                        className={cn(
                          "relative flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 transition-all duration-200 overflow-hidden",
                          active
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/60 bg-background/50 hover:border-primary/40 hover:bg-background"
                        )}
                      >
                        {active && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                        )}
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-colors relative z-10",
                            active ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <span className={cn(
                          "text-[10px] sm:text-xs font-semibold relative z-10",
                          active ? "text-primary" : "text-muted-foreground"
                        )}>
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5" 
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Preparing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue to Verification <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </GuestLayout>
    </GuestOnly>
  );
}
