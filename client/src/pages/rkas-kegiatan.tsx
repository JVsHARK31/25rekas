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
  Download,
  AlertTriangle,
  Save
} from "lucide-react";
import PeriodSelector, { PeriodType, Quarter, Month } from "@/components/dashboard/period-selector";
import KegiatanForm from "@/components/forms/kegiatan-form";
import ColumnManager, { TableColumn, renderTableCell } from "@/components/rkas/column-manager";
import { useKegiatanDB } from "@/hooks/use-kegiatan-db";
import { usePreferences } from "@/hooks/use-preferences";
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

  // Column management state
  const [columns, setColumns] = useState<TableColumn[]>([
    { id: '1', key: 'namaGiat', label: 'Nama Kegiatan', visible: true, type: 'text', required: true, sortable: true },
    { id: '2', key: 'kodeGiat', label: 'Kode Kegiatan', visible: true, type: 'text', required: false, sortable: true },
    { id: '3', key: 'namaDana', label: 'Sumber Dana', visible: true, type: 'badge', required: true, sortable: true },
    { id: '4', key: 'tw1', label: 'TW1', visible: false, type: 'currency', required: false, sortable: true },
    { id: '5', key: 'tw2', label: 'TW2', visible: false, type: 'currency', required: false, sortable: true },
    { id: '6', key: 'tw3', label: 'TW3', visible: false, type: 'currency', required: false, sortable: true },
    { id: '7', key: 'tw4', label: 'TW4', visible: false, type: 'currency', required: false, sortable: true },
    { id: '8', key: 'realisasi', label: 'Realisasi', visible: false, type: 'currency', required: false, sortable: true },
    { id: '9', key: 'status', label: 'Status', visible: true, type: 'status', required: true, sortable: true },
    { id: '10', key: 'tanggal', label: 'Tanggal', visible: true, type: 'date', required: false, sortable: true },
    { id: '11', key: 'subtitle', label: 'Deskripsi', visible: false, type: 'text', required: false, sortable: false }
  ]);

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

  // Use database CRUD operations
  const { activities, loading, createKegiatan, updateKegiatan, deleteKegiatan } = useKegiatanDB();
  
  // Use preferences hook for saving filter settings
  const { savePreferences } = usePreferences();

  // Filter activities based on selected period
  const filteredActivities = activities.filter(activity => {
    const activityName = activity.namaGiat || activity.name || '';
    const activityBidang = activity.bidang || '';
    const matchesSearch = activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activityBidang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesBidang = bidangFilter === 'all' || activityBidang === bidangFilter;
    const matchesYear = true; // Temporarily disable year filter until we have proper year data
    
    let matchesPeriod = true;
    if (selectedPeriodType === 'quarterly') {
      // For now, show all activities regardless of quarter
      matchesPeriod = true;
    } else if (selectedPeriodType === 'monthly') {
      // For now, show all activities regardless of month
      matchesPeriod = true;
    }

    return matchesSearch && matchesStatus && matchesBidang && matchesYear && matchesPeriod;
  });

  // Handle CRUD operations
  const handleCreateActivity = async (data: any) => {
    console.log('Form data being submitted:', data);
    try {
      await createKegiatan(data);
      toast({
        title: "Berhasil!",
        description: `Kegiatan "${data.name}" berhasil ditambahkan ke database.`,
      });
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Gagal!",
        description: "Terjadi kesalahan saat menyimpan kegiatan.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateActivity = async (id: string, data: any) => {
    await updateKegiatan(id, data);
  };

  const handleDeleteActivity = async (id: string) => {
    await deleteKegiatan(id);
  };

  const handleAddColumn = (column: Omit<TableColumn, 'id'>) => {
    const newColumn: TableColumn = {
      ...column,
      id: Date.now().toString()
    };
    setColumns(prev => [...prev, newColumn]);
  };

  const visibleColumns = columns.filter(col => col.visible);

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
                <KegiatanForm
                  mode="create"
                  onSubmit={handleCreateActivity}
                  selectedYear={selectedYear}
                  selectedQuarter={selectedQuarter}
                  selectedMonth={selectedMonth}
                  periodType={selectedPeriodType}
                />
              </div>
            </div>
          </div>

          {/* Advanced Period Selector with Save Button */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Filter Periode</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => savePreferences({
                    periodType: selectedPeriodType,
                    selectedQuarter,
                    selectedMonth,
                    selectedYear,
                    lastUsedPage: 'rkas-kegiatan'
                  })}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Filter</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

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

                <ColumnManager 
                  columns={columns}
                  onColumnsChange={setColumns}
                  onAddColumn={handleAddColumn}
                />
                
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
                  {filteredActivities.length} dari {activities.length} kegiatan
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
                  <KegiatanForm
                    mode="create"
                    onSubmit={handleCreateActivity}
                    selectedYear={selectedYear}
                    selectedQuarter={selectedQuarter}
                    selectedMonth={selectedMonth}
                    periodType={selectedPeriodType}
                    trigger={
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Kegiatan Pertama
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {visibleColumns.map((column) => (
                          <th 
                            key={column.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column.label}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredActivities.map((activity: any) => (
                        <tr key={activity.id} className="hover:bg-gray-50">
                          {visibleColumns.map((column) => (
                            <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                              {column.key === 'namaGiat' ? (
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {activity.namaGiat || activity.name || 'Nama kegiatan tidak tersedia'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {activity.subtitle || activity.description || 'Kode: ' + (activity.kodeGiat || '-')}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-900">
                                  {renderTableCell(activity[column.key], column)}
                                </div>
                              )}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" title="Lihat Detail">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <KegiatanForm
                                mode="edit"
                                initialData={activity}
                                onSubmit={(data) => handleUpdateActivity(activity.id, data)}
                                selectedYear={selectedYear}
                                selectedQuarter={selectedQuarter}
                                selectedMonth={selectedMonth}
                                periodType={selectedPeriodType}
                                trigger={
                                  <Button variant="ghost" size="sm" title="Edit Kegiatan">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900" title="Hapus Kegiatan">
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
                                        Apakah Anda yakin ingin menghapus kegiatan "{activity.namaGiat || activity.name || 'ini'}"? 
                                        Tindakan ini tidak dapat dibatalkan.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDeleteActivity(activity.id)}
                                      >
                                        Hapus
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                        </tr>
                      ))}
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