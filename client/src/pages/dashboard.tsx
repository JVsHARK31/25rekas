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
  Zap,
  Info
} from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { DashboardStats } from "@/types/rkas";
import { calculateReferenceStats } from "@/lib/mock-data-reference";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  // Use reference mock data for exact replica
  const stats = calculateReferenceStats();
  const statsLoading = false;

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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard RKAS Jakarta</h2>
              <p className="text-slate-600">Selamat datang di Sistem RKAS SMPN 25 Jakarta</p>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">Tahun Anggaran 2025</p>
              <p className="text-xs opacity-90">Status: Aktif</p>
            </div>
          </div>

          {/* System Demo Notice - Matching reference design */}
          <Alert className="border-green-200 bg-green-50 mb-6">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Sistem Demo:</strong> Anda sedang menggunakan sistem demo RKAS dengan data simulasi SMPN 25 Jakarta.
              Semua fitur dapat digunakan untuk keperluan evaluasi dan pelatihan.
            </AlertDescription>
          </Alert>

          {/* Stats Cards - 4x2 Grid Layout matching reference design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Row 1 */}
            {/* Total Kegiatan */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Total Kegiatan</p>
                    <div className="text-2xl font-bold text-blue-600">
                      {statsLoading ? (
                        <div className="animate-pulse h-8 w-12 bg-gray-200 rounded" />
                      ) : (
                        stats.totalActivities
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Kegiatan RKAS terdaftar</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Anggaran */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Total Anggaran</p>
                    <div className="text-2xl font-bold text-green-600">
                      {statsLoading ? (
                        <div className="animate-pulse h-8 w-24 bg-gray-200 rounded" />
                      ) : (
                        formatCurrency(stats.totalBudget)
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Anggaran keseluruhan</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-50">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kegiatan Disetujui */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Kegiatan Disetujui</p>
                    <div className="text-2xl font-bold text-emerald-600">
                      {statsLoading ? (
                        <div className="animate-pulse h-8 w-12 bg-gray-200 rounded" />
                      ) : (
                        stats.approvedActivities
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Sudah mendapat persetujuan</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menunggu Persetujuan */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Menunggu Persetujuan</p>
                    <div className="text-2xl font-bold text-orange-600">
                      {statsLoading ? (
                        <div className="animate-pulse h-8 w-12 bg-gray-200 rounded" />
                      ) : (
                        stats.pendingActivities
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Dalam proses review</p>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-50">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards - Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Realisasi Anggaran */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Realisasi Anggaran</p>
                    <div className="text-2xl font-bold text-purple-600">
                      {statsLoading ? (
                        <div className="animate-pulse h-8 w-24 bg-gray-200 rounded" />
                      ) : (
                        formatCurrency(stats.realizedBudget)
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stats.budgetUtilization.toFixed(1)}% dari total</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kegiatan Terlambat */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Kegiatan Terlambat</p>
                    <div className="text-2xl font-bold text-red-600">
                      {statsLoading ? (
                        <div className="animate-pulse h-8 w-12 bg-gray-200 rounded" />
                      ) : (
                        stats.lateActivities
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Perlu perhatian khusus</p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Capaian */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Target Capaian</p>
                    <div className="text-2xl font-bold text-indigo-600">85%</div>
                    <p className="text-xs text-gray-500 mt-1">Target semester ini</p>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <Target className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aktivitas Hari Ini */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Aktivitas Hari Ini</p>
                    <div className="text-2xl font-bold text-teal-600">12</div>
                    <p className="text-xs text-gray-500 mt-1">Update dan perubahan</p>
                  </div>
                  <div className="p-2 rounded-lg bg-teal-50">
                    <Zap className="h-4 w-4 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Pengembangan Perpustakaan</p>
                        <p className="text-sm text-gray-600">Status: Disetujui</p>
                      </div>
                      <span className="text-sm text-green-600 font-medium">2 jam lalu</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Kegiatan Ekstrakurikuler</p>
                        <p className="text-sm text-gray-600">Status: Menunggu Review</p>
                      </div>
                      <span className="text-sm text-orange-600 font-medium">4 jam lalu</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Pemeliharaan Gedung</p>
                        <p className="text-sm text-gray-600">Status: Draft</p>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">1 hari lalu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <p className="font-medium text-blue-900">Tambah Kegiatan RKAS</p>
                      <p className="text-sm text-blue-600">Buat kegiatan baru</p>
                    </button>
                    <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <p className="font-medium text-green-900">Export Laporan</p>
                      <p className="text-sm text-green-600">Download laporan RKAS</p>
                    </button>
                    <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                      <p className="font-medium text-purple-900">Import Data</p>
                      <p className="text-sm text-purple-600">Upload file Excel</p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
