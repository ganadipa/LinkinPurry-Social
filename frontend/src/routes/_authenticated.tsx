import Loading from "@/components/loading";
import { useAuth } from "@/hooks/auth";
import { redirect } from "@/lib/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    redirect({
      to: "/signin",
    });
    return;
  }

  return <Outlet />;
}
