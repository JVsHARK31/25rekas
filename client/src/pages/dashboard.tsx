import { useEffect, useState } from "react";
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
import PeriodSelector, { PeriodType, Quarter, Month } from "@/components/dashboard/period-selector";
import AdvancedStatsGrid from "@/components/dashboard/advanced-stats-grid";
import ResponsiveChartSection from "@/components/dashboard/responsive-chart-section";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Period selection state
  const [selectedPeriodType, setSelectedPeriodType] = useState<PeriodType>('quarterly');
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('TW1');
  const [selectedMonth, setSelectedMonth] = useState<Month>(1);
  const [selectedYear, setSelectedYear] = useState(2025);

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

          {/* Advanced Period Selector */}
          <PeriodSelector
            selectedPeriodType={selectedPeriodType}
            selectedQuarter={selectedQuarter}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onPeriodTypeChange={setSelectedPeriodType}
            onQuarterChange={setSelectedQuarter}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          {/* Advanced Stats Grid with Period-based Data */}
          <AdvancedStatsGrid
            periodType={selectedPeriodType}
            selectedQuarter={selectedQuarter}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />

          {/* Responsive Chart Section */}
          <ResponsiveChartSection
            periodType={selectedPeriodType}
            selectedQuarter={selectedQuarter}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />

          {/* Enhanced Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <span>Aktivitas Terbaru</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900">Pengembangan Perpustakaan</h4>
                        <p className="text-sm text-green-700 mb-2">Status: Disetujui - Anggaran Rp 11,000,000</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Bidang Kurikulum</span>
                          <span className="text-sm text-green-600 font-medium">2 jam lalu</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-900">Kegiatan Ekstrakurikuler</h4>
                        <p className="text-sm text-orange-700 mb-2">Status: Menunggu Review - Anggaran Rp 8,000,000</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">Bidang Kesiswaan</span>
                          <span className="text-sm text-orange-600 font-medium">4 jam lalu</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Edit className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Pemeliharaan Gedung</h4>
                        <p className="text-sm text-gray-700 mb-2">Status: Draft - Anggaran Rp 30,000,000</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">Sarana Prasarana</span>
                          <span className="text-sm text-gray-600 font-medium">1 hari lalu</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 text-sm text-blue-600 hover:text-blue-800 font-medium py-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    Lihat Semua Aktivitas →
                  </button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <button className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 border border-blue-200 group">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">Tambah Kegiatan RKAS</p>
                          <p className="text-sm text-blue-600">Buat kegiatan baru</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 border border-green-200 group">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">Export Laporan</p>
                          <p className="text-sm text-green-600">Download laporan RKAS</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all duration-200 border border-purple-200 group">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-900">Import Data</p>
                          <p className="text-sm text-purple-600">Upload file Excel</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-4 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all duration-200 border border-orange-200 group">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-orange-900">Monitoring</p>
                          <p className="text-sm text-orange-600">Pantau progress real-time</p>
                        </div>
                      </div>
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
