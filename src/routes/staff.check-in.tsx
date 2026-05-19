import { createFileRoute } from "@tanstack/react-router";
import { AccessDenied } from "@/components/access-denied";
import { StaffDashboard } from "@/components/staff-dashboard";
import { canAccess } from "@/lib/access-control";
import { useCarwashStore } from "@/lib/carwash-store";

export const Route = createFileRoute("/staff/check-in")({
  component: StaffCheckInPage,
});

function StaffCheckInPage() {
  const { role } = useCarwashStore();

  if (!canAccess(role, ["Staff", "Admin"])) {
    return (
      <div className="p-6 md:p-10">
        <AccessDenied
          title="Check-in access is restricted"
          description="Only Staff and Admin roles can process arrivals and walk-ins."
          role={role}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Staff check-in</h1>
          <p className="text-sm text-muted-foreground">
            Check in confirmed bookings or register walk-ins before wash session processing.
          </p>
        </div>
        <StaffDashboard />
      </div>
    </div>
  );
}

