import {
  Outlet,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
//   useParams,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import UserListPage from "@/pages/UserListPage";
import ConnectionRequestsPage from "@/pages/ConnectionRequestsPage";
import ConnectionsPage from "@/pages/ConnectionsPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/users" className="[&.active]:font-bold">
          Users
        </Link>
        <Link to="/connections" className="[&.active]:font-bold">
          Connections
        </Link>
        <Link to="/requests" className="[&.active]:font-bold">
          Requests
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    );
  },
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    return <div className="p-2">Hello from About!</div>;
  },
});

const userListRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/users",
    component: UserListPage,
  });
  
  const connectionRequestsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/requests",
    component: ConnectionRequestsPage,
  });
  
  const connectionsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/connections",
    component: ConnectionsPage,
  });

  const routeTree = rootRoute.addChildren([
    indexRoute,
    aboutRoute,
    userListRoute,
    connectionRequestsRoute,
    connectionsRoute,
  ]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    return (
      <div className="p-2">
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back home
        </Link>
      </div>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
