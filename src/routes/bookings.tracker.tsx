import { createFileRoute } from "@tanstack/react-router";
import { AccessDenied } from "@/components/access-denied";
import { LiveTracker } from "@/components/live-tracker";
import { canAccess } from "@/lib/access-control";
import { useCarwashStore } from "@/lib/carwash-store";

export const Route = createFileRoute("/bookings/tracker")({
  component: BookingTrackerPage,
});

function BookingTrackerPage() {
  const { role } = useCarwashStore();

  if (!canAccess(role, ["Customer", "Admin"])) {
    return (
      <div className="p-6 md:p-10">
        <AccessDenied
          title="Tracker access is restricted"
          description="Only Customer and Admin roles can open the booking tracker view."
          role={role}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Booking tracker</h1>
          <p className="text-sm text-muted-foreground">
            Follow the status chain from pending to checked-in without breaking the main flow.
          </p>
        </div>
        <LiveTracker />
      </div>
    </div>
  );
}

