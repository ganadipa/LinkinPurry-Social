import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <main>
      <div>Root layout</div>
      <Outlet />
    </main>
  );
}
