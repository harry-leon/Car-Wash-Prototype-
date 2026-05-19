import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { CustomerBookingsContent } from "@/routes/bookings";

export const Route = createFileRoute("/customer/bookings")({
  component: CustomerBookingsPage,
});

function CustomerBookingsPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/customer/bookings") {
    return <Outlet />;
  }

  return <CustomerBookingsContent />;
}
