import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { FileText, Download, TrendingUp, Calendar, Search, Target, DollarSign } from "lucide-react";

export default function LaporanRealisasi() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [bidangFilter, setBidangFilter] = useState("all");

  // Sample realisasi data per bidang
  const realisasiData = [
    {
      id: 1,
      bidang: "Kurikulum",
      totalKegiatan: 8,
      kegiatanSelesai: 6,
      anggaranAlokasi: 250000000,
      anggaranRealisasi: 225000000,
      persentaseKegiatan: 75,
      persentaseAnggaran: 90,
      status: "on-track"
    },
    {
      id: 2,
      bidang: "Sarana Prasarana",
      totalKegiatan: 12,
      kegiatanSelesai: 8,
      anggaranAlokasi: 500000000,
      anggaranRealisasi: 350000000,
      persentaseKegiatan: 67,
      persentaseAnggaran: 70,
      status: "behind"
    },
    {
      id: 3,
      bidang: "Pendidik & Tenaga",
      totalKegiatan: 5,
      kegiatanSelesai: 5,
      anggaranAlokasi: 150000000,
      anggaranRealisasi: 148000000,
      persentaseKegiatan: 100,
      persentaseAnggaran: 99,
      status: "completed"
    },
    {
      id: 4,
      bidang: "Kesiswaan",
      totalKegiatan: 6,
      kegiatanSelesai: 3,
      anggaranAlokasi: 100000000,
      anggaranRealisasi: 45000000,
      persentaseKegiatan: 50,
      persentaseAnggaran: 45,
      status: "behind"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-track': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'behind': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'at-risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'on-track': return 'Sesuai Target';
      case 'behind': return 'Terlambat';
      case 'at-risk': return 'Berisiko';
      default: return status;
    }
  };

  const filteredData = realisasiData.filter(item => {
    const matchesSearch = item.bidang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBidang = bidangFilter === 'all' || item.bidang === bidangFilter;
    
    return matchesSearch && matchesBidang;
  });

  // Calculate overall statistics
  const totalKegiatan = filteredData.reduce((sum, item) => sum + item.totalKegiatan, 0);
  const totalSelesai = filteredData.reduce((sum, item) => sum + item.kegiatanSelesai, 0);
  const totalAnggaran = filteredData.reduce((sum, item) => sum + item.anggaranAlokasi, 0);
  const totalRealisasi = filteredData.reduce((sum, item) => sum + item.anggaranRealisasi, 0);

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
              Laporan realisasi anggaran per bidang kegiatan
            </p>
          </div>
          <div className="flex space-x-2">
            <Button className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kegiatan</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalKegiatan}</div>
              <p className="text-xs text-muted-foreground">
                kegiatan terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kegiatan Selesai</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSelesai}</div>
              <p className="text-xs text-muted-foreground">
                {totalKegiatan > 0 ? ((totalSelesai / totalKegiatan) * 100).toFixed(1) : 0}% selesai
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anggaran</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAnggaran)}</div>
              <p className="text-xs text-muted-foreground">
                alokasi anggaran
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Realisasi</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRealisasi)}</div>
              <p className="text-xs text-muted-foreground">
                {totalAnggaran > 0 ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1) : 0}% terealisasi
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
                    placeholder="Cari bidang..."
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
                  <SelectItem value="TW1">TW1 2025</SelectItem>
                  <SelectItem value="TW2">TW2 2025</SelectItem>
                  <SelectItem value="TW3">TW3 2025</SelectItem>
                  <SelectItem value="TW4">TW4 2025</SelectItem>
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
                  <SelectItem value="Kesiswaan">Kesiswaan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Realisasi Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.bidang}</CardTitle>
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Kegiatan Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progress Kegiatan</span>
                    <span className="font-semibold">
                      {item.kegiatanSelesai}/{item.totalKegiatan} ({item.persentaseKegiatan}%)
                    </span>
                  </div>
                  <Progress value={item.persentaseKegiatan} className="h-2" />
                </div>

                {/* Anggaran Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Realisasi Anggaran</span>
                    <span className="font-semibold">{item.persentaseAnggaran}%</span>
                  </div>
                  <Progress value={item.persentaseAnggaran} className="h-2" />
                </div>

                {/* Financial Details */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="text-xs text-gray-500">Anggaran</div>
                    <div className="font-semibold text-sm">
                      {formatCurrency(item.anggaranAlokasi)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Realisasi</div>
                    <div className="font-semibold text-sm text-green-600">
                      {formatCurrency(item.anggaranRealisasi)}
                    </div>
                  </div>
                </div>

                {/* Remaining Budget */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Sisa Anggaran</div>
                  <div className="font-semibold text-sm">
                    {formatCurrency(item.anggaranAlokasi - item.anggaranRealisasi)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Tidak ada data realisasi yang sesuai dengan filter</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Summary */}
        {filteredData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan Keseluruhan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Progress Kegiatan</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Kegiatan</span>
                      <span className="font-semibold">{totalKegiatan}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Kegiatan Selesai</span>
                      <span className="font-semibold text-green-600">{totalSelesai}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Persentase Penyelesaian</span>
                      <span className="font-semibold">
                        {totalKegiatan > 0 ? ((totalSelesai / totalKegiatan) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Realisasi Anggaran</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Anggaran</span>
                      <span className="font-semibold">{formatCurrency(totalAnggaran)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Realisasi</span>
                      <span className="font-semibold text-green-600">{formatCurrency(totalRealisasi)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Persentase Realisasi</span>
                      <span className="font-semibold">
                        {totalAnggaran > 0 ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}