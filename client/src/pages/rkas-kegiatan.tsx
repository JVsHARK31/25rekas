import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Clock,
  FileText,
  Edit,
  Trash2,
  Eye,
  Download
} from "lucide-react";
import PeriodSelector, { PeriodType, Quarter, Month } from "@/components/dashboard/period-selector";

interface RKASActivity {
  id: string;
  name: string;
  bidang: string;
  standard: string;
  budget: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  quarter: Quarter;
  month: Month;
  year: number;
  createdAt: string;
  description: string;
  responsible: string;
}

export default function RKASKegiatan() {
  // Period filtering state
  const [selectedPeriodType, setSelectedPeriodType] = useState<PeriodType>('quarterly');
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('TW1');
  const [selectedMonth, setSelectedMonth] = useState<Month>(1);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bidangFilter, setBidangFilter] = useState<string>("all");

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
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Disetujui';
      case 'pending': return 'Menunggu';
      case 'draft': return 'Draft';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  // Mock data for activities with period-specific filtering
  const generateMockActivities = (): RKASActivity[] => {
    const bidangList = [
      'Kurikulum', 'Kesiswaan', 'Sarana Prasarana', 'Pendidik & Tenaga',
      'Pembiayaan', 'Budaya Sekolah', 'Kemitraan', 'Evaluasi'
    ];
    
    const activities: RKASActivity[] = [];
    
    for (let i = 1; i <= 50; i++) {
      const bidang = bidangList[Math.floor(Math.random() * bidangList.length)];
      const quarter = ['TW1', 'TW2', 'TW3', 'TW4'][Math.floor(Math.random() * 4)] as Quarter;
      const month = (Math.floor(Math.random() * 12) + 1) as Month;
      const status = ['approved', 'pending', 'draft', 'rejected'][Math.floor(Math.random() * 4)] as any;
      
      activities.push({
        id: `activity-${i}`,
        name: `Kegiatan ${bidang} ${i}`,
        bidang,
        standard: `Standar ${i}`,
        budget: Math.floor(Math.random() * 50000000) + 5000000,
        status,
        quarter,
        month,
        year: selectedYear,
        createdAt: new Date().toISOString(),
        description: `Deskripsi kegiatan ${bidang} untuk periode yang dipilih`,
        responsible: `PIC Bidang ${bidang}`
      });
    }
    
    return activities;
  };

  const mockActivities = generateMockActivities();

  // Filter activities based on selected period
  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.bidang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesBidang = bidangFilter === 'all' || activity.bidang === bidangFilter;
    const matchesYear = activity.year === selectedYear;
    
    let matchesPeriod = true;
    if (selectedPeriodType === 'quarterly') {
      matchesPeriod = activity.quarter === selectedQuarter;
    } else if (selectedPeriodType === 'monthly') {
      matchesPeriod = activity.month === selectedMonth;
    }

    return matchesSearch && matchesStatus && matchesBidang && matchesYear && matchesPeriod;
  });

  const getPeriodLabel = () => {
    if (selectedPeriodType === 'quarterly') {
      const quarterLabels = {
        'TW1': 'Triwulan 1 (Jan-Mar)',
        'TW2': 'Triwulan 2 (Apr-Jun)', 
        'TW3': 'Triwulan 3 (Jul-Sep)',
        'TW4': 'Triwulan 4 (Okt-Des)'
      };
      return quarterLabels[selectedQuarter];
    } else {
      const monthLabels = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return monthLabels[selectedMonth - 1];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">RKAS Kegiatan</h1>
                <p className="text-gray-600 mt-2">
                  Kelola kegiatan RKAS berdasarkan periode {getPeriodLabel()} {selectedYear}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{filteredActivities.length} Kegiatan</span>
                </Badge>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Tambah Kegiatan</span>
                </Button>
              </div>
            </div>
          </div>

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

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter & Pencarian</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari kegiatan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={bidangFilter} onValueChange={setBidangFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bidang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bidang</SelectItem>
                    <SelectItem value="Kurikulum">Kurikulum</SelectItem>
                    <SelectItem value="Kesiswaan">Kesiswaan</SelectItem>
                    <SelectItem value="Sarana Prasarana">Sarana Prasarana</SelectItem>
                    <SelectItem value="Pendidik & Tenaga">Pendidik & Tenaga</SelectItem>
                    <SelectItem value="Pembiayaan">Pembiayaan</SelectItem>
                    <SelectItem value="Budaya Sekolah">Budaya Sekolah</SelectItem>
                    <SelectItem value="Kemitraan">Kemitraan</SelectItem>
                    <SelectItem value="Evaluasi">Evaluasi</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activities Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Daftar Kegiatan - {getPeriodLabel()} {selectedYear}</span>
                </div>
                <Badge variant="outline">
                  {filteredActivities.length} dari {mockActivities.length} kegiatan
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredActivities.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada kegiatan</h3>
                  <p className="text-gray-500">
                    Tidak ada kegiatan yang ditemukan untuk periode {getPeriodLabel()} {selectedYear}
                  </p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Kegiatan Pertama
                  </Button>
                </div>
              ) : (
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
                          Anggaran
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Periode
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredActivities.map((activity) => {
                        const activityPeriod = selectedPeriodType === 'quarterly' 
                          ? `${activity.quarter} ${activity.year}`
                          : `${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][activity.month - 1]} ${activity.year}`;

                        return (
                          <tr key={activity.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {activity.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {activity.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="secondary">{activity.bidang}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(activity.budget)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusColor(activity.status)}>
                                {getStatusLabel(activity.status)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{activityPeriod}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}