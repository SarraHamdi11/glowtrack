import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Jobs from "@/pages/Jobs";
import Tasks from "@/pages/Tasks";
import Habits from "@/pages/Habits";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient();

function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!token) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">{() => <PrivateRoute component={Dashboard} />}</Route>
      <Route path="/jobs">{() => <PrivateRoute component={Jobs} />}</Route>
      <Route path="/tasks">{() => <PrivateRoute component={Tasks} />}</Route>
      <Route path="/habits">{() => <PrivateRoute component={Habits} />}</Route>
      <Route path="/analytics">{() => <PrivateRoute component={Analytics} />}</Route>
      <Route path="/profile">{() => <PrivateRoute component={Profile} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
