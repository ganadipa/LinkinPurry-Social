import ProfilePage2 from "@/pages/ProfilePage2";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/profile/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <ProfilePage2 id={Number(id)} />;
}
