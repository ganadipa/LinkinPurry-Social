import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/chat")({
  component: Outlet,
});
