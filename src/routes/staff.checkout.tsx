import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/routes/checkout";

export const Route = createFileRoute("/staff/checkout")({
  component: CheckoutPage,
});
