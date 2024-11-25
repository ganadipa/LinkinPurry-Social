import { AuthProvider } from "./contexts/auth-context";
import { useAuth } from "./hooks/auth";
import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800">
//       <header className="bg-blue-700 py-6 text-white">
//         <div className="container mx-auto flex items-center justify-between px-6">
//           <h1 className="text-2xl font-bold">LinkInPurry</h1>
//           <Button variant="secondary" className="bg-blue-600 hover:bg-blue-500">
//             Sign Up
//           </Button>
//         </div>
//       </header>

//       <section className="bg-white py-16">
//         <div className="container mx-auto flex flex-col items-center text-center px-6">
//           <h2 className="text-4xl font-extrabold mb-4">
//             Welcome to LinkInPurry
//           </h2>
//           <p className="text-lg text-gray-600 mb-6">
//             Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis
//             quasi dicta esse!
//           </p>
//           <Button
//             size="lg"
//             className="bg-blue-700 text-white hover:bg-blue-600"
//           >
//             Get Started
//           </Button>
//         </div>
//       </section>

//       <section className="py-16 bg-gray-100">
//         <div className="container mx-auto px-6 text-center">
//           <h3 className="text-3xl font-bold mb-6">Card Component</h3>
//           <div className="grid gap-6 md:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Card Title 1</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>
//                   Lorem ipsum dolor sit amet consectetur, adipisicing elit.
//                   Dolor!
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Card Title 2</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>
//                   Lorem ipsum dolor sit amet consectetur, adipisicing elit.
//                   Enim, natus?
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Card Title 3</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                   Dolorum.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       <section className="bg-blue-700 text-white py-16">
//         <div className="container mx-auto text-center px-6">
//           <h3 className="text-3xl font-bold mb-4">Input Component</h3>
//           <div className="flex justify-center">
//             <Input
//               type="email"
//               placeholder="Enter your email"
//               className="mr-4 max-w-md"
//             />
//             <Button
//               variant="secondary"
//               className="bg-white text-blue-700 hover:bg-gray-200"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-gray-800 text-gray-400 py-6">
//         <div className="container mx-auto text-center">
//           <p>© 2024 LinkInPurry. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

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
  console.log("Auth", auth);
  return <RouterProvider router={router} context={{ authentication: auth }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
