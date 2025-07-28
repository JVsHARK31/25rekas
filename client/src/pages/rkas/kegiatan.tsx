import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Filter, Edit, Trash2, FileText, Eye, RefreshCw } from "lucide-react";
import { mockAPI, initializeMockData } from "@/lib/mock-data";

export default function KegiatanRKAS() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activitiesData, setActivitiesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [bidangOptions, setBidangOptions] = useState([]);
  const [standarOptions, setStandarOptions] = useState([]);
  const [danaOptions, setDanaOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
    totalBudget: 0
  });

  const [formData, setFormData] = useState({
    kode_giat: "",
    nama_giat: "",
    subtitle: "",
    bidang_id: "",
    standar_id: "",
    dana_id: "",
    tw1: 0,
    tw2: 0,
    tw3: 0,
    tw4: 0,
    total: null as number | null,
    showManualTotal: false,
    tahun: 2025,
    status: "draft"
  });

  useEffect(() => {
    initializeMockData();
    loadAllData();
  }, []);

  useEffect(() => {
    let filtered = activitiesData;
    
    if (searchTerm) {
      filtered = filtered.filter((item: any) => 
        item.kode_giat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_giat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((item: any) => item.status === statusFilter);
    }
    
    setFilteredData(filtered);
  }, [activitiesData, searchTerm, statusFilter]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load activities
      const activities = mockAPI.getActivities();
      setActivitiesData(activities);
      setFilteredData(activities);
      
      // Load options for dropdowns
      setBidangOptions(mockAPI.getBidang());
      setStandarOptions(mockAPI.getStandar());
      setDanaOptions(mockAPI.getDana());
      
      // Calculate stats
      const totalBudget = activities.reduce((sum: number, item: any) => {
        const tw1 = parseFloat(item.tw1) || 0;
        const tw2 = parseFloat(item.tw2) || 0;
        const tw3 = parseFloat(item.tw3) || 0;
        const tw4 = parseFloat(item.tw4) || 0;
        return sum + tw1 + tw2 + tw3 + tw4;
      }, 0);
      
      setStats({
        total: activities.length,
        draft: activities.filter((item: any) => item.status === "draft").length,
        submitted: activities.filter((item: any) => item.status === "submitted").length,
        approved: activities.filter((item: any) => item.status === "approved").length,
        rejected: activities.filter((item: any) => item.status === "rejected").length,
        totalBudget
      });
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data kegiatan RKAS",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    toast({
      title: "Berhasil",
      description: "Data berhasil dimuat ulang",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Calculate final total - use manual if provided, otherwise auto-calculate
      const finalTotal = formData.total !== null ? formData.total : (formData.tw1 + formData.tw2 + formData.tw3 + formData.tw4);
      
      const activityData = {
        ...formData,
        total: finalTotal
      };
      
      await mockAPI.addActivity(activityData);
      toast({
        title: "Berhasil",
        description: `Kegiatan RKAS berhasil ditambahkan dengan total anggaran ${formatCurrency(finalTotal)}`,
      });
      setIsDialogOpen(false);
      resetForm();
      loadAllData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan kegiatan RKAS",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      kode_giat: "",
      nama_giat: "",
      subtitle: "",
      bidang_id: "",
      standar_id: "",
      dana_id: "",
      tw1: 0,
      tw2: 0,
      tw3: 0,
      tw4: 0,
      total: null,
      showManualTotal: false,
      tahun: 2025,
      status: "draft"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      submitted: { label: "Submitted", className: "bg-blue-100 text-blue-800" },
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="erkas-loading h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Kegiatan RKAS</h2>
              <p className="text-slate-600">Kelola kegiatan dan program sekolah</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Kegiatan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Kegiatan RKAS</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                    <TabsTrigger value="budget">Anggaran</TabsTrigger>
                  </TabsList>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <TabsContent value="basic" className="space-y-4">
                      <div>
                        <Label htmlFor="kodeGiat">Kode Kegiatan</Label>
                        <Input
                          id="kodeGiat"
                          value={formData.kode_giat}
                          onChange={(e) => setFormData({...formData, kode_giat: e.target.value})}
                          placeholder="Contoh: 01.3.02.01.2.001"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="namaGiat">Nama Kegiatan</Label>
                        <Input
                          id="namaGiat"
                          value={formData.nama_giat}
                          onChange={(e) => setFormData({...formData, nama_giat: e.target.value})}
                          placeholder="Masukkan nama kegiatan"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Deskripsi/Subtitle</Label>
                        <Input
                          id="subtitle"
                          value={formData.subtitle}
                          onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                          placeholder="Masukkan deskripsi kegiatan"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bidangId">Bidang Kegiatan</Label>
                          <Select
                            value={formData.bidang_id}
                            onValueChange={(value) => setFormData({...formData, bidang_id: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih bidang" />
                            </SelectTrigger>
                            <SelectContent>
                              {bidangOptions.map((bidang: any) => (
                                <SelectItem key={bidang.id} value={bidang.id}>
                                  {bidang.kode_bidang} - {bidang.nama_bidang}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="danaId">Sumber Dana</Label>
                          <Select
                            value={formData.dana_id}
                            onValueChange={(value) => setFormData({...formData, dana_id: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih sumber dana" />
                            </SelectTrigger>
                            <SelectContent>
                              {danaOptions.map((dana: any) => (
                                <SelectItem key={dana.id} value={dana.id}>
                                  {dana.kode_dana} - {dana.nama_dana}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="budget" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tw1">Triwulan 1 (TW1)</Label>
                          <Input
                            id="tw1"
                            type="number"
                            value={formData.tw1}
                            onChange={(e) => setFormData({...formData, tw1: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tw2">Triwulan 2 (TW2)</Label>
                          <Input
                            id="tw2"
                            type="number"
                            value={formData.tw2}
                            onChange={(e) => setFormData({...formData, tw2: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tw3">Triwulan 3 (TW3)</Label>
                          <Input
                            id="tw3"
                            type="number"
                            value={formData.tw3}
                            onChange={(e) => setFormData({...formData, tw3: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tw4">Triwulan 4 (TW4)</Label>
                          <Input
                            id="tw4"
                            type="number"
                            value={formData.tw4}
                            onChange={(e) => setFormData({...formData, tw4: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        {/* Auto-calculated total */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-slate-600">Total Anggaran (Otomatis):</div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData({...formData, showManualTotal: !formData.showManualTotal})}
                              className="text-xs h-6"
                            >
                              {formData.showManualTotal ? 'Gunakan Otomatis' : 'Edit Manual'}
                            </Button>
                          </div>
                          <div className="text-lg font-semibold text-slate-900">
                            {formatCurrency(formData.tw1 + formData.tw2 + formData.tw3 + formData.tw4)}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Dihitung otomatis dari penjumlahan TW1-TW4
                          </div>
                        </div>

                        {/* Manual total input (optional) */}
                        {formData.showManualTotal && (
                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <div className="flex items-center justify-between mb-2">
                              <Label htmlFor="totalManual" className="text-sm font-medium text-amber-800">
                                Total Anggaran Manual (Opsional)
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFormData({...formData, total: null, showManualTotal: false})}
                                className="text-red-600 hover:text-red-800 text-xs h-6"
                              >
                                ✕ Hapus
                              </Button>
                            </div>
                            <Input
                              id="totalManual"
                              type="number"
                              value={formData.total || ""}
                              onChange={(e) => setFormData({...formData, total: e.target.value ? parseInt(e.target.value) : null})}
                              placeholder="Masukkan total anggaran manual"
                              className="mb-2"
                            />
                            <div className="text-xs text-amber-700">
                              {formData.total ? 
                                `Manual: ${formatCurrency(formData.total)}` : 
                                'Kosongkan untuk menggunakan perhitungan otomatis'
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Simpan
                    </Button>
                  </div>
                  </form>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Kegiatan</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    ✓
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Draft/Pending</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.draft + stats.submitted}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    ⏱
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Anggaran</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(stats.totalBudget)}</p>
                  </div>
                  <span className="text-2xl">💰</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <Input
                  type="text"
                  placeholder="Cari kegiatan..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kegiatan RKAS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Kode Kegiatan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Nama Kegiatan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Bidang</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Anggaran</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item: any) => {
                      const total = (parseFloat(item.tw1) || 0) + (parseFloat(item.tw2) || 0) + 
                                   (parseFloat(item.tw3) || 0) + (parseFloat(item.tw4) || 0);
                      const bidang = bidangOptions.find((b: any) => b.id === item.bidang_id);
                      const dana = danaOptions.find((d: any) => d.id === item.dana_id);
                      
                      return (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-medium text-slate-900">{item.kode_giat}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-slate-900 font-medium">{item.nama_giat}</div>
                              {item.subtitle && (
                                <div className="text-sm text-slate-600 mt-1">{item.subtitle}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {bidang ? `${bidang.kode || bidang.id} - ${bidang.nama || bidang.nama_bidang}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">
                            {formatCurrency(total)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" title="Edit kegiatan">
                                <Edit size={14} />
                              </Button>
                              <Button variant="outline" size="sm" title="Lihat detail">
                                <Eye size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}