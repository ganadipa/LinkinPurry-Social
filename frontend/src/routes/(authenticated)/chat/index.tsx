import ChatPage from "@/pages/chat/chat-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/chat/")({
  component: ChatPage,
});
