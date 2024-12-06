import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/auth-context";
import { useAuth } from "./hooks/auth";
import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";

const router = createRouter({
  routeTree,
  caseSensitive: false,
  defaultPreload: false,
  context: { authentication: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ authentication: auth }} />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
        }}
      />
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </>
  );
}
