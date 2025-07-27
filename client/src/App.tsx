import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";

import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import RkasManagement from "@/pages/rkas-management";
import FileManagement from "@/pages/file-management";
import UserManagement from "@/pages/user-management";
import BudgetAnalysis from "@/pages/budget-analysis";
import Workflow from "@/pages/workflow";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/rkas" component={RkasManagement} />
      <Route path="/files" component={FileManagement} />
      <Route path="/users" component={UserManagement} />
      <Route path="/budget-analysis" component={BudgetAnalysis} />
      <Route path="/workflow" component={Workflow} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
