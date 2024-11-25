import { AuthContext } from "@/contexts/auth-context";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

type RouterContext = {
  authentication: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <main>
        <div>Root layout</div>
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
