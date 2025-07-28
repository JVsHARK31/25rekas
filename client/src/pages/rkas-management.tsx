import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Download, Plus } from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import RkasTable from "@/components/rkas/rkas-table";
import AddActivityForm from "@/components/rkas/add-activity-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { RkasActivity } from "@/types/rkas";

export default function RkasManagement() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    bidang: "all",
    dana: "all",
    status: "all",
    search: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  // Transform data from snake_case to camelCase
  const transformActivity = (activity: any): RkasActivity => ({
    id: activity.id,
    standardId: activity.standard_id,
    kodeGiat: activity.kode_giat,
    namaGiat: activity.nama_giat,
    subtitle: activity.subtitle,
    kodeDana: activity.kode_dana,
    namaDana: activity.nama_dana,
    tw1: activity.tw1?.toString() || '0',
    tw2: activity.tw2?.toString() || '0',
    tw3: activity.tw3?.toString() || '0',
    tw4: activity.tw4?.toString() || '0',
    total: activity.total?.toString() || '0',
    realisasi: activity.realisasi?.toString() || '0',
    tanggal: activity.tanggal,
    noPesanan: activity.no_pesanan,
    status: activity.status || 'draft',
    createdBy: activity.created_by,
    createdAt: activity.created_at,
    updatedAt: activity.updated_at,
  });

  const { data: rawActivities, isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/activities'],
    enabled: isAuthenticated,
    retry: 3,
    retryDelay: 1000,
  });

  // Transform the data
  const activities = rawActivities?.map(transformActivity) || [];

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="erkas-loading h-8 w-8" />
      </div>
    );
  }

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    console.log("Exporting to Excel...");
  };

  return (
    <div className="min-h-screen bg-erkas-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">RKAS Management</h2>
              <p className="text-erkas-secondary">Kelola data Rencana Kegiatan dan Anggaran Sekolah</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleExportExcel}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Download className="mr-2" size={16} />
                Export Excel
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-erkas-success text-white hover:bg-green-600">
                    <Plus className="mr-2" size={16} />
                    Tambah Kegiatan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
                  </DialogHeader>
                  <AddActivityForm onSuccess={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filter and Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Bidang</Label>
                  <Select value={filters.bidang} onValueChange={(value) => setFilters({...filters, bidang: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Bidang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Bidang</SelectItem>
                      <SelectItem value="01">01 - Kurikulum</SelectItem>
                      <SelectItem value="02">02 - Kesiswaan</SelectItem>
                      <SelectItem value="03">03 - Sarana & Prasarana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Sumber Dana</Label>
                  <Select value={filters.dana} onValueChange={(value) => setFilters({...filters, dana: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Dana" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Dana</SelectItem>
                      <SelectItem value="bop">BOP Reguler</SelectItem>
                      <SelectItem value="bos">BOS Reguler</SelectItem>
                      <SelectItem value="dak">DAK Fisik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Pencarian</Label>
                  <Input
                    type="text"
                    placeholder="Cari kegiatan..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RKAS Data Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="erkas-loading h-8 w-8" />
                  <span className="ml-3 text-erkas-secondary">Memuat data kegiatan...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <div className="text-red-500 mb-2">⚠️ Terjadi kesalahan saat memuat data</div>
                  <div className="text-sm text-erkas-secondary mb-4">
                    {error instanceof Error ? error.message : 'Gagal memuat data kegiatan'}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="text-sm"
                  >
                    Coba Lagi
                  </Button>
                </div>
              ) : (
                <RkasTable activities={activities} filters={filters} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
