import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Edit,
  Eye,
  Download,
  BarChart3,
  Target,
  PieChart,
  Trash2,
  AlertTriangle
} from "lucide-react";
import PeriodSelector, { PeriodType, Quarter, Month } from "@/components/dashboard/period-selector";
import AnggaranForm from "@/components/forms/anggaran-form";
import { useAnggaranDB } from "@/hooks/use-anggaran-db";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BudgetItem {
  id: string;
  activity: string;
  bidang: string;
  standard: string;
  allocatedBudget: number;
  usedBudget: number;
  remainingBudget: number;
  quarter: Quarter;
  month: Month;
  year: number;
  status: 'on-track' | 'over-budget' | 'under-budget';
  responsible: string;
  lastUpdated: string;
}

export default function RKASAnggaran() {
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
      case 'on-track': return 'bg-green-100 text-green-800 border-green-200';
      case 'over-budget': return 'bg-red-100 text-red-800 border-red-200';
      case 'under-budget': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track': return 'Sesuai Target';
      case 'over-budget': return 'Over Budget';
      case 'under-budget': return 'Under Budget';
      default: return status;
    }
  };

  // Use database CRUD operations
  const { budgetItems, loading, createBudgetItem, updateBudgetItem, deleteBudgetItem } = useAnggaranDB();

  // Filter budget items based on selected period
  const filteredBudgetItems = budgetItems.filter(item => {
    const matchesSearch = item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.bidang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesBidang = bidangFilter === 'all' || item.bidang === bidangFilter;
    const matchesYear = item.year === selectedYear;
    
    let matchesPeriod = true;
    if (selectedPeriodType === 'quarterly') {
      matchesPeriod = item.quarter === selectedQuarter;
    } else if (selectedPeriodType === 'monthly') {
      matchesPeriod = item.month === selectedMonth;
    }

    return matchesSearch && matchesStatus && matchesBidang && matchesYear && matchesPeriod;
  });

  // Handle CRUD operations
  const handleCreateBudgetItem = async (data: any) => {
    await createBudgetItem(data);
  };

  const handleUpdateBudgetItem = async (id: string, data: any) => {
    await updateBudgetItem(id, data);
  };

  const handleDeleteBudgetItem = async (id: string) => {
    await deleteBudgetItem(id);
  };

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

  // Calculate summary statistics
  const totalAllocated = filteredBudgetItems.reduce((sum: number, item: any) => sum + Number(item.allocatedBudget), 0);
  const totalUsed = filteredBudgetItems.reduce((sum: number, item: any) => sum + Number(item.usedBudget), 0);
  const totalRemaining = filteredBudgetItems.reduce((sum: number, item: any) => sum + Number(item.remainingBudget), 0);
  const utilizationPercentage = totalAllocated > 0 ? (totalUsed / totalAllocated) * 100 : 0;

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
                <h1 className="text-3xl font-bold text-gray-900">RKAS Anggaran</h1>
                <p className="text-gray-600 mt-2">
                  Kelola anggaran RKAS berdasarkan periode {getPeriodLabel()} {selectedYear}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{formatCurrency(totalAllocated)}</span>
                </Badge>
                <AnggaranForm
                  mode="create"
                  onSubmit={handleCreateBudgetItem}
                  selectedYear={selectedYear}
                  selectedQuarter={selectedQuarter}
                  selectedMonth={selectedMonth}
                  periodType={selectedPeriodType}
                />
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

          {/* Budget Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Total Alokasi</p>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalAllocated)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{filteredBudgetItems.length} item anggaran</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Sudah Terpakai</p>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalUsed)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{utilizationPercentage.toFixed(1)}% terpakai</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-50">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Sisa Anggaran</p>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(totalRemaining)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{(100 - utilizationPercentage).toFixed(1)}% tersisa</p>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-50">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Tingkat Pemanfaatan</p>
                    <div className="text-2xl font-bold text-purple-600">
                      {utilizationPercentage.toFixed(1)}%
                    </div>
                    <div className="mt-2">
                      <Progress value={utilizationPercentage} className="h-2" />
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
                    placeholder="Cari anggaran..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status Anggaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="on-track">Sesuai Target</SelectItem>
                    <SelectItem value="over-budget">Over Budget</SelectItem>
                    <SelectItem value="under-budget">Under Budget</SelectItem>
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

          {/* Budget Items Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Rincian Anggaran - {getPeriodLabel()} {selectedYear}</span>
                </div>
                <Badge variant="outline">
                  {filteredBudgetItems.length} dari {budgetItems.length} item
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredBudgetItems.length === 0 ? (
                <div className="text-center py-12">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data anggaran</h3>
                  <p className="text-gray-500">
                    Tidak ada anggaran yang ditemukan untuk periode {getPeriodLabel()} {selectedYear}
                  </p>
                  <AnggaranForm
                    mode="create"
                    onSubmit={handleCreateBudgetItem}
                    selectedYear={selectedYear}
                    selectedQuarter={selectedQuarter}
                    selectedMonth={selectedMonth}
                    periodType={selectedPeriodType}
                    trigger={
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Anggaran Pertama
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Anggaran
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bidang
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alokasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Terpakai
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sisa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBudgetItems.map((item) => {
                        const usagePercentage = (item.usedBudget / item.allocatedBudget) * 100;

                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.activity}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.responsible}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="secondary">{item.bidang}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(item.allocatedBudget)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              {formatCurrency(item.usedBudget)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                              {formatCurrency(item.remainingBudget)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusColor(item.status)}>
                                {getStatusLabel(item.status)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className="w-16">
                                  <Progress value={usagePercentage} className="h-2" />
                                </div>
                                <span className="text-xs text-gray-500">{usagePercentage.toFixed(0)}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" title="Lihat Detail">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <AnggaranForm
                                  mode="edit"
                                  initialData={{
                                    ...item,
                                    month: typeof item.month === 'number' ? item.month.toString() : item.month
                                  }}
                                  onSubmit={(data) => handleUpdateBudgetItem(item.id, data)}
                                  selectedYear={selectedYear}
                                  selectedQuarter={selectedQuarter}
                                  selectedMonth={selectedMonth}
                                  periodType={selectedPeriodType}
                                  trigger={
                                    <Button variant="ghost" size="sm" title="Edit Anggaran">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  }
                                />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900" title="Hapus Anggaran">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="flex items-center space-x-2">
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                        <span>Konfirmasi Hapus</span>
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Apakah Anda yakin ingin menghapus anggaran "{item.activity}"? 
                                        Tindakan ini tidak dapat dibatalkan.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDeleteBudgetItem(item.id)}
                                      >
                                        Hapus
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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