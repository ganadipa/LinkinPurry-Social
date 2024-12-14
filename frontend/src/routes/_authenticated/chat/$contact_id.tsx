import { createFileRoute, redirect } from "@tanstack/react-router";
import ChatPage from "@/pages/chat/chat-page";

export const Route = createFileRoute("/_authenticated/chat/$contact_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const contact_id = Route.useParams().contact_id;

  // If, when parsed to a number, the contact_id is not a number, return null
  const num = Number(contact_id);
  if (isNaN(num)) {
    return redirect({
      to: "/chat",
    });
  }

  return <ChatPage contact_id={num} />;
}
