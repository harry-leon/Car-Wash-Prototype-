import { createFileRoute } from "@tanstack/react-router";
import { HistoryPage } from "@/routes/transactions";

export const Route = createFileRoute("/customer/transactions")({
  component: HistoryPage,
});
