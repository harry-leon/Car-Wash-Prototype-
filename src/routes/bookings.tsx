import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { AccessDenied } from "@/components/access-denied";
import { RouteRedirect } from "@/components/route-redirect";
import { CustomerHistory } from "@/components/customer-history";
import { canAccess } from "@/lib/access-control";
import { useCarwashStore } from "@/lib/carwash-store";

export const Route = createFileRoute("/bookings")({
  component: BookingListPage,
});

export function BookingListPage() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { role } = useCarwashStore();

  if (!canAccess(role, ["Customer", "Admin"])) {
    return (
      <div className="p-6 md:p-10">
        <AccessDenied
          title="Bookings are restricted"
          description="Only Customer and Admin roles can review customer booking history."
          role={role}
        />
      </div>
    );
  }

  if (pathname !== "/bookings") {
    return <Outlet />;
  }

  return <RouteRedirect to="/customer/bookings" />;
}

export function CustomerBookingsContent() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Customer bookings</h1>
          <p className="text-sm text-muted-foreground">
            Review current bookings, cancel valid ones and jump to the live tracker.
          </p>
        </div>
        <CustomerHistory onTrack={() => navigate({ to: "/customer/bookings/tracker" })} />
      </div>
    </div>
  );
}

