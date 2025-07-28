import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { FileText, Download, Calendar, Search, BarChart3, DollarSign, Target } from "lucide-react";

export default function LaporanRKAS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tahunFilter, setTahunFilter] = useState("2025");
  const [bidangFilter, setBidangFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample RKAS report data
  const rkasData = [
    {
      id: 1,
      kodeKegiatan: "01.3.02.01.2.001",
      namaKegiatan: "Pengembangan Perpustakaan 2025",
      bidang: "Sarana Prasarana",
      standar: "Standar Sarana dan Prasarana",
      tw1: 50000000,
      tw2: 60000000,
      tw3: 40000000,
      tw4: 50000000,
      total: 200000000,
      realisasi: 150000000,
      persentaseRealisasi: 75,
      status: "approved",
      pic: "Ahmad Wijaya"
    },
    {
      id: 2,
      kodeKegiatan: "01.3.02.01.2.101",
      namaKegiatan: "Pelatihan Guru Kurikulum 2025",
      bidang: "Pendidik & Tenaga",
      standar: "Standar Pendidik dan Tenaga Kependidikan",
      tw1: 30000000,
      tw2: 0,
      tw3: 30000000,
      tw4: 0,
      total: 60000000,
      realisasi: 25000000,
      persentaseRealisasi: 42,
      status: "approved",
      pic: "Siti Rahayu"
    },
    {
      id: 3,
      kodeKegiatan: "01.3.02.01.2.201",
      namaKegiatan: "Program Literasi Digital",
      bidang: "Kurikulum",
      standar: "Standar Isi",
      tw1: 20000000,
      tw2: 20000000,
      tw3: 20000000,
      tw4: 20000000,
      total: 80000000,
      realisasi: 0,
      persentaseRealisasi: 0,
      status: "draft",
      pic: "Budi Santoso"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Disetujui';
      case 'draft': return 'Draft';
      case 'pending': return 'Menunggu';
      case 'rejected': return 'Ditolak';
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

  const filteredData = rkasData.filter(item => {
    const matchesSearch = item.namaKegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.kodeKegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.pic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBidang = bidangFilter === 'all' || item.bidang === bidangFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesBidang && matchesStatus;
  });

  // Summary statistics
  const totalAnggaran = filteredData.reduce((sum, item) => sum + item.total, 0);
  const totalRealisasi = filteredData.reduce((sum, item) => sum + item.realisasi, 0);
  const approvedCount = filteredData.filter(item => item.status === 'approved').length;
  const draftCount = filteredData.filter(item => item.status === 'draft').length;

  const generateReport = () => {
    // In real implementation, this would generate and download the report
    console.log('Generating RKAS report...');
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Laporan RKAS</h1>
            <p className="text-gray-600 mt-1">
              Laporan lengkap Rencana Kegiatan dan Anggaran Sekolah
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={generateReport} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
            <Button variant="outline" onClick={generateReport} className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Export Excel</span>
            </Button>
          </div>
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
                Total alokasi anggaran {tahunFilter}
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
                {totalAnggaran > 0 ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1) : 0}% dari anggaran
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">
                kegiatan telah disetujui
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftCount}</div>
              <p className="text-xs text-muted-foreground">
                kegiatan masih draft
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari kegiatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={tahunFilter} onValueChange={setTahunFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bidangFilter} onValueChange={setBidangFilter}>
                <SelectTrigger>
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* RKAS Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail RKAS Tahun {tahunFilter}</CardTitle>
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
                      Bidang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TW1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TW2
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TW3
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TW4
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Realisasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                          <div className="text-xs text-gray-400">
                            PIC: {item.pic}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">{item.bidang}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.tw1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.tw2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.tw3)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.tw4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.realisasi)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.persentaseRealisasi}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Tidak ada data RKAS yang sesuai dengan filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Footer */}
        {filteredData.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalAnggaran)}
                  </div>
                  <div className="text-sm text-gray-500">Total Anggaran</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalRealisasi)}
                  </div>
                  <div className="text-sm text-gray-500">Total Realisasi</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalAnggaran > 0 ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Persentase Realisasi</div>
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