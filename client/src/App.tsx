// import { Switch, Route } from "wouter";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "./lib/queryClient";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { useEffect, useState } from "react";
// import { getCurrentUser } from "@/lib/auth";
// import { User } from "@shared/schema";

// import Landing from "@/pages/landing";
// import Auth from "@/pages/auth";
// import Dashboard from "@/pages/dashboard";
// import History from "@/pages/history";
// import NotFound from "@/pages/not-found";

// function Router() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const currentUser = await getCurrentUser();
//         setUser(currentUser);
//       } catch (error) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen gradient-bg flex items-center justify-center">
//         <div className="glass-effect p-8 rounded-2xl">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="text-muted-foreground mt-4">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Switch>
//       <Route path="/" component={() => user ? <Dashboard user={user} setUser={setUser} /> : <Landing />} />
//       <Route path="/auth" component={() => user ? <Dashboard user={user} setUser={setUser} /> : <Auth setUser={setUser} />} />
//       <Route path="/dashboard" component={() => user ? <Dashboard user={user} setUser={setUser} /> : <Auth setUser={setUser} />} />
//       <Route path="/history" component={() => user ? <History user={user} setUser={setUser} /> : <Auth setUser={setUser} />} />
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <div className="dark">
//           <Router />
//           <Toaster />
//         </div>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;


// import { useEffect, useState } from "react";
// import { Route, Switch, Redirect } from "wouter"; // "BrowserRouter" has been removed from here
// import Dashboard from "./pages/dashboard";
// import Auth from "./pages/auth";
// import Landing from "./pages/landing";
// import NotFound from "./pages/not-found";
// import History from "./pages/history";
// import { User, getLoggedInUser } from "./lib/auth";
// import { Toaster } from "@/components/ui/toaster";

// function App() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function checkUser() {
//       const loggedInUser = await getLoggedInUser();
//       setUser(loggedInUser);
//       setLoading(false);
//     }
//     checkUser();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Or a proper loading spinner
//   }

//   return (
//     <>
//       <main className="min-h-screen">
//         <Switch>
//           <Route path="/">
//             {user ? <Redirect to="/dashboard" /> : <Landing />}
//           </Route>
//           <Route path="/auth">
//             {user ? <Redirect to="/dashboard" /> : <Auth setUser={setUser} />}
//           </Route>
//           <Route path="/dashboard">
//             {!user ? <Redirect to="/auth" /> : <Dashboard user={user} setUser={setUser} />}
//           </Route>
//           <Route path="/history">
//             {!user ? <Redirect to="/auth" /> : <History user={user} setUser={setUser} />}
//           </Route>
//           <Route>
//             <NotFound />
//           </Route>
//         </Switch>
//       </main>
//       <Toaster />
//     </>
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { User, getLoggedInUser } from "./lib/auth";
import Dashboard from "./pages/dashboard";
import History from "./pages/history";
import Auth from "./pages/auth";
import Landing from "./pages/landing";
import NotFound from "./pages/not-found";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();

  // THE FIX: Central state for the active file and conversation
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  // When the user navigates away from the dashboard, we keep the state,
  // but if they go to history, we can load a new conversation there.
  const handleConversationSelect = (convId: string, fileId: string | null) => {
    setConversationId(convId);
    setSelectedFileId(fileId);
    setLocation("/dashboard"); // Navigate to dashboard to view the selected chat
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <main className="min-h-screen">
        <Switch>
          <Route path="/">
            {user ? <Redirect to="/dashboard" /> : <Landing />}
          </Route>
          <Route path="/auth">
            {user ? <Redirect to="/dashboard" /> : <Auth setUser={setUser} />}
          </Route>
          <Route path="/dashboard">
            {!user ? (
              <Redirect to="/auth" />
            ) : (
              <Dashboard
                user={user}
                setUser={setUser}
                selectedFileId={selectedFileId}
                setSelectedFileId={setSelectedFileId}
                conversationId={conversationId}
                setConversationId={setConversationId}
              />
            )}
          </Route>
          <Route path="/history">
            {!user ? (
              <Redirect to="/auth" />
            ) : (
              <History
                user={user}
                setUser={setUser}
                onConversationSelect={handleConversationSelect}
              />
            )}
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </main>
      <Toaster />
    </>
  );
}

export default App;