import { createFileRoute } from "@tanstack/react-router";
import { AccessDenied } from "@/components/access-denied";
import { StaffDashboard } from "@/components/staff-dashboard";
import { canAccess } from "@/lib/access-control";
import { useCarwashStore } from "@/lib/carwash-store";

export const Route = createFileRoute("/staff/check-in")({
  component: () => <StaffCheckInPage />,
});

export function StaffCheckInPage() {
  const { role } = useCarwashStore();

  if (!canAccess(role, ["Staff"])) {
    return (
      <div className="p-6 md:p-10">
        <AccessDenied
          title="Check-in access is restricted"
          description="Only Staff roles can process arrivals and walk-ins."
          role={role}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-border/50 pb-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Staff check-in</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Check in confirmed bookings or register walk-ins before wash session processing.
          </p>
        </div>
        <StaffDashboard />
      </div>
    </div>
  );
}

