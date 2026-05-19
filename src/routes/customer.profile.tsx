import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/routes/profile";

export const Route = createFileRoute("/customer/profile")({
  component: ProfilePage,
});
