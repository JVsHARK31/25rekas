import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Calendar,
  DollarSign,
  Target,
  TrendingDown
} from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { DashboardStats } from "@/types/rkas";

export default function BudgetAnalysis() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="erkas-loading h-8 w-8" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const realizationPercentage = stats ? 
    (stats.budget.realized / stats.budget.total * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-erkas-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Budget Analysis</h2>
            <p className="text-erkas-secondary">Analisis mendalam realisasi anggaran dan tren pengeluaran</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Total Budget</p>
                    <div className="text-2xl font-bold text-slate-900">
                      {statsLoading ? (
                        <div className="erkas-loading h-6 w-24" />
                      ) : (
                        formatCurrency(stats?.budget.total || 0)
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="text-erkas-primary" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Realisasi</p>
                    <div className="text-2xl font-bold text-slate-900">
                      {statsLoading ? (
                        <div className="erkas-loading h-6 w-24" />
                      ) : (
                        formatCurrency(stats?.budget.realized || 0)
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-erkas-success" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Persentase Realisasi</p>
                    <div className="text-2xl font-bold text-slate-900">
                      {statsLoading ? (
                        <div className="erkas-loading h-6 w-16" />
                      ) : (
                        `${realizationPercentage}%`
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Target className="text-purple-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Sisa Budget</p>
                    <div className="text-2xl font-bold text-slate-900">
                      {statsLoading ? (
                        <div className="erkas-loading h-6 w-24" />
                      ) : (
                        formatCurrency((stats?.budget.total || 0) - (stats?.budget.realized || 0))
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="text-yellow-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Realisasi Budget per Bidang
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-slate-400 mb-4">📊</div>
                    <p className="text-erkas-secondary">Budget Realization Chart</p>
                    <p className="text-xs text-slate-400 mt-2">Chart implementation in progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2" size={20} />
                  Distribusi Anggaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-slate-400 mb-4">🥧</div>
                    <p className="text-erkas-secondary">Budget Distribution Chart</p>
                    <p className="text-xs text-slate-400 mt-2">Chart implementation in progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quarterly Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2" size={20} />
                Analisis Triwulan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">TW1</h3>
                  <p className="text-sm text-erkas-secondary">Jan - Mar</p>
                  <div className="text-lg font-bold text-slate-900 mt-2">
                    {formatCurrency(250000000)}
                  </div>
                  <p className="text-xs text-erkas-success">Target: 25%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">TW2</h3>
                  <p className="text-sm text-erkas-secondary">Apr - Jun</p>
                  <div className="text-lg font-bold text-slate-900 mt-2">
                    {formatCurrency(320000000)}
                  </div>
                  <p className="text-xs text-erkas-success">Target: 30%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">TW3</h3>
                  <p className="text-sm text-erkas-secondary">Jul - Sep</p>
                  <div className="text-lg font-bold text-slate-900 mt-2">
                    {formatCurrency(280000000)}
                  </div>
                  <p className="text-xs text-erkas-success">Target: 25%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">TW4</h3>
                  <p className="text-sm text-erkas-secondary">Oct - Dec</p>
                  <div className="text-lg font-bold text-slate-900 mt-2">
                    {formatCurrency(210000000)}
                  </div>
                  <p className="text-xs text-erkas-success">Target: 20%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}