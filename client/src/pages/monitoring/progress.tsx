import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { BarChart3, TrendingUp, Target, DollarSign, Calendar, Search, Filter } from "lucide-react";

export default function MonitoringProgress() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bidangFilter, setBidangFilter] = useState("all");

  // Sample monitoring data - in real app, this would come from database
  const progressData = [
    {
      id: 1,
      namaKegiatan: "Pengembangan Perpustakaan 2025",
      bidang: "Sarana Prasarana",
      totalAnggaran: 200000000,
      realisasi: 150000000,
      persentase: 75,
      status: "on-track",
      targetSelesai: "2025-12-31",
      pic: "Ahmad Wijaya"
    },
    {
      id: 2,
      namaKegiatan: "Pelatihan Guru Kurikulum 2025",
      bidang: "Pendidik & Tenaga",
      totalAnggaran: 60000000,
      realisasi: 25000000,
      persentase: 42,
      status: "behind",
      targetSelesai: "2025-06-30",
      pic: "Siti Rahayu"
    },
    {
      id: 3,
      namaKegiatan: "Program Literasi Digital",
      bidang: "Kurikulum",
      totalAnggaran: 80000000,
      realisasi: 85000000,
      persentase: 106,
      status: "over-budget",
      targetSelesai: "2025-08-31",
      pic: "Budi Santoso"
    },
    {
      id: 4,
      namaKegiatan: "Renovasi Ruang Kelas",
      bidang: "Sarana Prasarana",
      totalAnggaran: 150000000,
      realisasi: 140000000,
      persentase: 93,
      status: "on-track",
      targetSelesai: "2025-09-30",
      pic: "Dewi Lestari"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 border-green-200';
      case 'behind': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'over-budget': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track': return 'Sesuai Target';
      case 'behind': return 'Terlambat';
      case 'over-budget': return 'Melebihi Anggaran';
      default: return status;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 80) return 'bg-green-500';
    if (percentage > 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredData = progressData.filter(item => {
    const matchesSearch = item.namaKegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.pic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesBidang = bidangFilter === 'all' || item.bidang === bidangFilter;
    
    return matchesSearch && matchesStatus && matchesBidang;
  });

  // Summary statistics
  const totalAnggaran = progressData.reduce((sum, item) => sum + item.totalAnggaran, 0);
  const totalRealisasi = progressData.reduce((sum, item) => sum + item.realisasi, 0);
  const avgProgress = progressData.reduce((sum, item) => sum + item.persentase, 0) / progressData.length;
  const onTrackCount = progressData.filter(item => item.status === 'on-track').length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Anggaran</h1>
            <p className="text-gray-600 mt-1">
              Monitoring progress dan realisasi anggaran kegiatan RKAS
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Export Laporan</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anggaran</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAnggaran)}</div>
              <p className="text-xs text-muted-foreground">
                Total alokasi anggaran
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Realisasi</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRealisasi)}</div>
              <p className="text-xs text-muted-foreground">
                {((totalRealisasi / totalAnggaran) * 100).toFixed(1)}% dari target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProgress.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Progress keseluruhan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesuai Target</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onTrackCount}</div>
              <p className="text-xs text-muted-foreground">
                dari {progressData.length} kegiatan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari kegiatan atau PIC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="on-track">Sesuai Target</SelectItem>
                  <SelectItem value="behind">Terlambat</SelectItem>
                  <SelectItem value="over-budget">Melebihi Anggaran</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bidangFilter} onValueChange={setBidangFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Bidang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Bidang</SelectItem>
                  <SelectItem value="Kurikulum">Kurikulum</SelectItem>
                  <SelectItem value="Sarana Prasarana">Sarana Prasarana</SelectItem>
                  <SelectItem value="Pendidik & Tenaga">Pendidik & Tenaga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Progress Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Progress Kegiatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{item.namaKegiatan}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Bidang:</span> {item.bidang}
                        </div>
                        <div>
                          <span className="font-medium">PIC:</span> {item.pic}
                        </div>
                        <div>
                          <span className="font-medium">Target Selesai:</span> {new Date(item.targetSelesai).toLocaleDateString('id-ID')}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Anggaran:</span> {formatCurrency(item.totalAnggaran)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Realisasi:</span> {formatCurrency(item.realisasi)}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-64 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-semibold">{item.persentase}%</span>
                      </div>
                      <Progress 
                        value={Math.min(item.persentase, 100)} 
                        className="h-3"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Tidak ada data yang sesuai dengan filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
          </div>
        </main>
      </div>
    </div>
  );
}