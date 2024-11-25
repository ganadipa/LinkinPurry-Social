import { useAuth } from "@/hooks/auth";
import { redirect } from "@/lib/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authorization)/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    redirect({ to: "/" });
    return;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col gap-4 items-center justify-center p-4">
      <Outlet />
    </div>
  );
}
