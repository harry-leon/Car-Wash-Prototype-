import { createFileRoute } from "@tanstack/react-router";
import { ConfirmationPage } from "@/routes/confirmation";

export const Route = createFileRoute("/staff/confirmation")({
  component: ConfirmationPage,
});
