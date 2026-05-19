import { createFileRoute } from "@tanstack/react-router";
import { LoyaltyPage } from "@/routes/loyalty";

export const Route = createFileRoute("/customer/loyalty")({
  component: LoyaltyPage,
});
