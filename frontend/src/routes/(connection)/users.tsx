import { createFileRoute } from "@tanstack/react-router";
import UserListPage from "@/pages/UserListPage";

export const Route = createFileRoute("/(connection)/users")({
  component: UserListPage,
});
