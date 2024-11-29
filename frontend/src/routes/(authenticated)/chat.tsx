import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "@/pages/chat/chat-page";

export const Route = createFileRoute("/(authenticated)/chat")({
  component: ChatPage,
});
