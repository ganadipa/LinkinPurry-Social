import { AuthContext } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Header from "@/components/layout/header";

type RouterContext = {
  authentication: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <main className="w-full">
        <div className="min-h-[700px] max-w-[1120px] mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}
