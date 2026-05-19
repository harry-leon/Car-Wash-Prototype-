import { createFileRoute } from "@tanstack/react-router";
import { BookingTrackerPage } from "@/routes/bookings.tracker";

export const Route = createFileRoute("/customer/bookings/tracker")({
  component: BookingTrackerPage,
});
