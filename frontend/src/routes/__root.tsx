import { AuthContext } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Header from "@/components/layout/header";
import { NotificationPrompt } from "@/components/specific/notification/notification-test";
import NotFound from "@/pages/not-found/NotFound";

type RouterContext = {
  authentication: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  const auth = useAuth();
  const user = auth.user;
  return (
    <>
      {user && <NotificationPrompt />}

      <main className="w-full flex-col flex-1">
        <Header />
        <div className="mx-auto mt-20 overflow-y w-full xl:w-[1280px]">
          <Outlet />
        </div>
      </main>
    </>
  );
}
