import Loading from "@/components/loading";
import { useAuth } from "@/hooks/auth";
import { redirect } from "@/lib/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const url = new URL(window.location.href);

  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    redirect({
      to: "/signin",
      params: { redirect: url.pathname },
    });
    return;
  }

  return <Outlet />;
}
