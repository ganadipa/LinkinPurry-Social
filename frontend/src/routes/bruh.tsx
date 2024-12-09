import { createFileRoute } from "@tanstack/react-router";
import { useConnectionRecommendation } from "@/hooks/connection-recommendations";

export const Route = createFileRoute("/bruh")({
  component: RouteComponent,
});

function RouteComponent() {
  const { users: recommendations } = useConnectionRecommendation();

  return "Hello /bruh!";
}
