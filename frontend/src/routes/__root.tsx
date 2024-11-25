import Header from "@/components/layout/header";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <main>
        <Header user={null} />
        <div>Root layout</div>
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
