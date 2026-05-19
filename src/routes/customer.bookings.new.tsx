import { createFileRoute } from "@tanstack/react-router";
import { NewBookingPage } from "@/routes/bookings.new";

export const Route = createFileRoute("/customer/bookings/new")({
  component: NewBookingPage,
});
