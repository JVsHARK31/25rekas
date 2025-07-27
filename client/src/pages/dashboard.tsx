import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  CheckCircle, 
  ClipboardList, 
  AlertTriangle,
  Edit,
  Check,
  Upload
} from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { DashboardStats } from "@/types/rkas";

export default function Dashboard() {
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

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-erkas-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h2>
            <p className="text-erkas-secondary">SMPN 25 Jakarta - Periode Anggaran 2024-2030</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Total Anggaran</p>
                    <div className="text-2xl font-bold text-slate-900">
                      {statsLoading ? (
                        <div className="erkas-loading h-6 w-24" />
                      ) : (
                        formatCurrency(stats?.budget.total || 0)
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-erkas-primary" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="text-erkas-success mr-1" size={16} />
                  <span className="text-erkas-success font-medium">12.5%</span>
                  <span className="text-erkas-secondary ml-1">dari tahun lalu</span>
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
                    <CheckCircle className="text-erkas-success" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-erkas-secondary">Persentase:</span>
                  <span className="text-slate-900 font-medium ml-1">
                    {stats && formatPercentage(stats.budget.realized, stats.budget.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Kegiatan Aktif</p>
                    <div className="text-2xl font-bold text-slate-900">
                      {statsLoading ? (
                        <div className="erkas-loading h-6 w-12" />
                      ) : (
                        stats?.activities.active || 0
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <ClipboardList className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-erkas-secondary">Status:</span>
                  <span className="text-slate-900 font-medium ml-1">Dalam Proses</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Revisi Pending</p>
                    <div className="text-2xl font-bold text-slate-900">
                      {statsLoading ? (
                        <div className="erkas-loading h-6 w-8" />
                      ) : (
                        stats?.revisions.pending || 0
                      )}
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-erkas-secondary">Memerlukan:</span>
                  <span className="text-slate-900 font-medium ml-1">Persetujuan</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Alokasi Anggaran per Bidang
                  </CardTitle>
                  <select className="text-sm border border-slate-300 rounded-lg px-3 py-2">
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-slate-400 mb-4">📊</div>
                    <p className="text-erkas-secondary">Budget Allocation Chart</p>
                    <p className="text-xs text-slate-400 mt-2">Chart implementation coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Aktivitas Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Edit className="text-erkas-primary text-xs" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">Data RKAS diperbarui</p>
                      <p className="text-xs text-erkas-secondary">Bidang Kurikulum - Pengembangan Standar Isi</p>
                      <p className="text-xs text-slate-400 mt-1">2 menit yang lalu</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-erkas-success text-xs" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">Pengajuan disetujui</p>
                      <p className="text-xs text-erkas-secondary">Revisi anggaran Q2 2024</p>
                      <p className="text-xs text-slate-400 mt-1">15 menit yang lalu</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Upload className="text-yellow-600 text-xs" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">File dokumen diunggah</p>
                      <p className="text-xs text-erkas-secondary">RAB_Perpustakaan_2024.pdf</p>
                      <p className="text-xs text-slate-400 mt-1">1 jam yang lalu</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 text-sm text-erkas-primary hover:text-blue-700 font-medium py-2">
                  Lihat Semua Aktivitas
                </button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
