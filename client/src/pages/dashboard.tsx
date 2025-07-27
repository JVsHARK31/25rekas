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
  Upload,
  Clock,
  FileText,
  DollarSign,
  Target,
  Zap
} from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { DashboardStats } from "@/types/rkas";
import { getBudgetYearsDescending, formatBudgetPeriod } from "@/lib/budget-years";

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
          {/* Header with Year Badge */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard RKAS</h2>
              <p className="text-slate-600">Selamat datang di Sistem RKAS SMPN 25 Jakarta</p>
            </div>
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium">
              Tahun Anggaran 2025
              <div className="text-xs opacity-90">Status: Aktif</div>
            </div>
          </div>

          {/* System Demo Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <p className="text-blue-800 text-sm">
                <strong>Sistem Demo:</strong> Anda sedang menggunakan sistem demo RKAS dengan data simulasi SMPN 25 Jakarta. 
                Semua fitur dapat digunakan untuk keperluan evaluasi dan pelatihan.
              </p>
            </div>
          </div>

          {/* Stats Cards - First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Kegiatan */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Kegiatan</p>
                    <div className="text-3xl font-bold text-blue-600">
                      {statsLoading ? (
                        <div className="erkas-loading h-8 w-12" />
                      ) : (
                        "0"
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Kegiatan RKAS terdaftar</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Anggaran */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Anggaran</p>
                    <div className="text-3xl font-bold text-green-600">
                      {statsLoading ? (
                        <div className="erkas-loading h-8 w-24" />
                      ) : (
                        "Rp 0"
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Anggaran keseluruhan</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kegiatan Disetujui */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Kegiatan Disetujui</p>
                    <div className="text-3xl font-bold text-green-600">
                      {statsLoading ? (
                        <div className="erkas-loading h-8 w-12" />
                      ) : (
                        "0"
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Sudah mendapat persetujuan</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menunggu Persetujuan */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Menunggu Persetujuan</p>
                    <div className="text-3xl font-bold text-orange-600">
                      {statsLoading ? (
                        <div className="erkas-loading h-8 w-12" />
                      ) : (
                        "0"
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Dalam proses review</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="text-orange-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards - Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Realisasi Anggaran */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Realisasi Anggaran</p>
                    <div className="text-3xl font-bold text-purple-600">
                      {statsLoading ? (
                        <div className="erkas-loading h-8 w-24" />
                      ) : (
                        "Rp 0"
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">0.0% dari total</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kegiatan Terlambat */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Kegiatan Terlambat</p>
                    <div className="text-3xl font-bold text-red-600">
                      {statsLoading ? (
                        <div className="erkas-loading h-8 w-12" />
                      ) : (
                        "0"
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Perlu perhatian khusus</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Capaian */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Target Capaian</p>
                    <div className="text-3xl font-bold text-blue-600">
                      {statsLoading ? (
                        <div className="erkas-loading h-8 w-12" />
                      ) : (
                        "0%"
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Target semester ini</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="text-blue-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aktivitas Hari Ini */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Aktivitas Hari Ini</p>
                    <div className="text-3xl font-bold text-teal-600">
                      {statsLoading ? (
                        <div className="erkas-loading h-8 w-12" />
                      ) : (
                        "12"
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Update dan perubahan</p>
                  </div>
                  <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Zap className="text-teal-600" size={24} />
                  </div>
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
                    {getBudgetYearsDescending().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
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
