import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/routes/notifications";

export const Route = createFileRoute("/staff/notifications")({
  component: NotificationsPage,
});
