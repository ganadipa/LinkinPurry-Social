import { AuthContext } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/header";

type RouterContext = {
  authentication: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main>
        <Header />
        <div className="mt-16">Root layout</div>
        <div>You are logged in as {user?.email ?? "guest"}</div>
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
