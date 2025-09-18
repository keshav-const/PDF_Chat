import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@shared/schema";

import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import History from "@/pages/history";
import NotFound from "@/pages/not-found";

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={() => user ? <Dashboard user={user} setUser={setUser} /> : <Landing />} />
      <Route path="/auth" component={() => user ? <Dashboard user={user} setUser={setUser} /> : <Auth setUser={setUser} />} />
      <Route path="/dashboard" component={() => user ? <Dashboard user={user} setUser={setUser} /> : <Auth setUser={setUser} />} />
      <Route path="/history" component={() => user ? <History user={user} setUser={setUser} /> : <Auth setUser={setUser} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
