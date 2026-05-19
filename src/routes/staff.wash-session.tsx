import { createFileRoute } from "@tanstack/react-router";
import { WashSessionPage } from "@/routes/wash-session";

export const Route = createFileRoute("/staff/wash-session")({
  component: WashSessionPage,
});
