import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <main>
        <Header user={null} />
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
