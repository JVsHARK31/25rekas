import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { FileText, Download, Eye, Calendar, Search, TrendingUp, AlertCircle } from "lucide-react";

export default function MonitoringRealisasi() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample realisasi data
  const realisasiData = [
    {
      id: 1,
      periode: "TW1 2025",
      namaKegiatan: "Pengembangan Perpustakaan 2025",
      kodeKegiatan: "01.3.02.01.2.001",
      anggaran: 50000000,
      realisasi: 48500000,
      persentase: 97,
      status: "completed",
      tanggalRealisasi: "2025-03-25",
      keterangan: "Pembelian buku dan peralatan selesai"
    },
    {
      id: 2,
      periode: "TW1 2025", 
      namaKegiatan: "Pelatihan Guru Kurikulum 2025",
      kodeKegiatan: "01.3.02.01.2.101",
      anggaran: 15000000,
      realisasi: 12000000,
      persentase: 80,
      status: "partial",
      tanggalRealisasi: "2025-03-20",
      keterangan: "Workshop tahap 1 selesai"
    },
    {
      id: 3,
      periode: "TW2 2025",
      namaKegiatan: "Program Literasi Digital",
      kodeKegiatan: "01.3.02.01.2.201",
      anggaran: 20000000,
      realisasi: 0,
      persentase: 0,
      status: "pending",
      tanggalRealisasi: null,
      keterangan: "Belum dimulai"
    },
    {
      id: 4,
      periode: "TW2 2025",
      namaKegiatan: "Renovasi Ruang Kelas",
      kodeKegiatan: "01.3.02.01.2.301",
      anggaran: 75000000,
      realisasi: 78000000,
      persentase: 104,
      status: "exceeded",
      tanggalRealisasi: "2025-06-15",
      keterangan: "Biaya material lebih tinggi dari perkiraan"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'exceeded': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'partial': return 'Sebagian';
      case 'exceeded': return 'Melebihi';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredData = realisasiData.filter(item => {
    const matchesSearch = item.namaKegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.kodeKegiatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = periodFilter === 'all' || item.periode === periodFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesPeriod && matchesStatus;
  });

  // Summary statistics
  const totalAnggaran = realisasiData.reduce((sum, item) => sum + item.anggaran, 0);
  const totalRealisasi = realisasiData.reduce((sum, item) => sum + item.realisasi, 0);
  const completedCount = realisasiData.filter(item => item.status === 'completed').length;
  const pendingCount = realisasiData.filter(item => item.status === 'pending').length;

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
            <h1 className="text-3xl font-bold text-gray-900">Laporan Realisasi</h1>
            <p className="text-gray-600 mt-1">
              Monitoring realisasi anggaran per periode dan kegiatan
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anggaran</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAnggaran)}</div>
              <p className="text-xs text-muted-foreground">
                Alokasi anggaran periode ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Realisasi</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRealisasi)}</div>
              <p className="text-xs text-muted-foreground">
                {((totalRealisasi / totalAnggaran) * 100).toFixed(1)}% dari anggaran
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kegiatan Selesai</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">
                dari {realisasiData.length} total kegiatan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">
                kegiatan belum direalisasi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari kegiatan atau kode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Periode</SelectItem>
                  <SelectItem value="TW1 2025">TW1 2025</SelectItem>
                  <SelectItem value="TW2 2025">TW2 2025</SelectItem>
                  <SelectItem value="TW3 2025">TW3 2025</SelectItem>
                  <SelectItem value="TW4 2025">TW4 2025</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="partial">Sebagian</SelectItem>
                  <SelectItem value="exceeded">Melebihi</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Realisasi Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Realisasi Anggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kegiatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anggaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Realisasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.namaKegiatan}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.kodeKegiatan}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{item.periode}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.anggaran)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.realisasi)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <span className={item.persentase > 100 ? 'text-red-600' : item.persentase > 80 ? 'text-green-600' : 'text-yellow-600'}>
                          {item.persentase}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="ghost" size="sm" title="Lihat Detail">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Tidak ada data realisasi yang sesuai dengan filter</p>
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