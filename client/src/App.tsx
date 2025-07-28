import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import ErrorBoundary from "@/components/error-boundary";

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

// RKAS Pages
import KegiatanRKAS from "@/pages/rkas/kegiatan";
import RincianAnggaran from "@/pages/rkas/rincian";
import AnggaranKas from "@/pages/rkas/kas";
import RealisasiRKAS from "@/pages/rkas/realisasi";
import RKASKegiatan from "@/pages/rkas-kegiatan";
import RKASAnggaran from "@/pages/rkas-anggaran";

// Master Data Pages
import BidangKegiatan from "@/pages/master/bidang";
import StandarNasional from "@/pages/master/standar";
import SumberDana from "@/pages/master/sumber-dana";
import Rekening from "@/pages/master/rekening";
import Komponen from "@/pages/master/komponen";

// Monitoring Pages
import MonitoringProgress from "@/pages/monitoring/progress";
import MonitoringRealisasi from "@/pages/monitoring/realisasi";

// Laporan Pages
import LaporanRKAS from "@/pages/laporan/rkas";
import LaporanRealisasi from "@/pages/laporan/realisasi";

// Admin Pages
import AdminUsers from "@/pages/admin/users";
import AdminSettings from "@/pages/admin/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={Dashboard} />
      
      {/* RKAS Routes */}
      <Route path="/rkas" component={RkasManagement} />
      <Route path="/rkas/kegiatan" component={KegiatanRKAS} />
      <Route path="/rkas/rincian" component={RincianAnggaran} />
      <Route path="/rkas/kas" component={AnggaranKas} />
      <Route path="/rkas/realisasi" component={RealisasiRKAS} />
      <Route path="/rkas-kegiatan" component={RKASKegiatan} />
      <Route path="/rkas-anggaran" component={RKASAnggaran} />
      
      {/* Master Data Routes */}
      <Route path="/master/bidang" component={BidangKegiatan} />
      <Route path="/master/standar" component={StandarNasional} />
      <Route path="/master/sumber-dana" component={SumberDana} />
      <Route path="/master/rekening" component={Rekening} />
      <Route path="/master/komponen" component={Komponen} />
      
      {/* Monitoring Routes */}
      <Route path="/monitoring/progress" component={MonitoringProgress} />
      <Route path="/monitoring/realisasi" component={MonitoringRealisasi} />
      
      {/* Laporan Routes */}
      <Route path="/laporan/rkas" component={LaporanRKAS} />
      <Route path="/laporan/realisasi" component={LaporanRealisasi} />
      
      {/* Admin Routes */}
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/settings" component={AdminSettings} />
      
      {/* Other Routes */}
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
          <ErrorBoundary>
            <Toaster />
            <Router />
          </ErrorBoundary>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
