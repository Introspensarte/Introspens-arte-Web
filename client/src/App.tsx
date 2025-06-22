import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/use-auth";

import LandingPage from "@/pages/landing";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
import PortalPage from "@/pages/portal";
import NotFound from "@/pages/not-found";

function Router() {
  const { user } = useAuth();
  console.log('Router - current user:', user);

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login">
        {user ? <Redirect to="/portal" /> : <LoginPage />}
      </Route>
      <Route path="/register">
        {user ? <Redirect to="/portal" /> : <RegisterPage />}
      </Route>
      <Route path="/portal">
        {user ? <PortalPage /> : <Redirect to="/login" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
