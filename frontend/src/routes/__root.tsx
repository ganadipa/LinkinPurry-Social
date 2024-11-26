import { AuthContext } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/header";
import Loading from "@/components/loading";

type RouterContext = {
  authentication: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center bg-[#f4f2ee]">
        <Loading />
      </main>
    );
  }

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
