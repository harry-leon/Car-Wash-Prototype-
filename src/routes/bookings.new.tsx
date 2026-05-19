import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AccessDenied } from "@/components/access-denied";
import { CustomerBookingForm } from "@/components/customer-booking-form";
import { canAccess } from "@/lib/access-control";
import { useCarwashStore } from "@/lib/carwash-store";

export const Route = createFileRoute("/bookings/new")({
  component: NewBookingPage,
});

function NewBookingPage() {
  const navigate = useNavigate();
  const { role } = useCarwashStore();

  if (!canAccess(role, ["Customer", "Admin"])) {
    return (
      <div className="p-6 md:p-10">
        <AccessDenied
          title="Booking creation is restricted"
          description="Only Customer and Admin roles can create a new booking from this module."
          role={role}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Create booking</h1>
          <p className="text-sm text-muted-foreground">
            Booking uses the active customer profile, vehicle data and shop slot validation.
          </p>
        </div>
        <CustomerBookingForm onBooked={() => navigate({ to: "/bookings" })} />
      </div>
    </div>
  );
}

