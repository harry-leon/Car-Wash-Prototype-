import { createFileRoute } from "@tanstack/react-router";
import { VehiclesPage } from "@/routes/vehicles";

export const Route = createFileRoute("/customer/vehicles")({
  component: VehiclesPage,
});
