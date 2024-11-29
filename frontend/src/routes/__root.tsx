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
      <main className="w-full flex-col flex-1">
        <div className="mx-auto overflow-y w-full md:w-[1120px]">
          <Outlet />
        </div>
      </main>
    </>
  );
}
