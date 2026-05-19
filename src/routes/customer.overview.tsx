import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/routes/index";

export const Route = createFileRoute("/customer/overview")({
  component: OverviewPage,
});
