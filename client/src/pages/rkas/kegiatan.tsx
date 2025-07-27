import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Filter, Edit } from "lucide-react";

export default function KegiatanRKAS() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    kodeKegiatan: "",
    namaKegiatan: "",
    bidang: "",
    anggaran: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsDialogOpen(false);
    setFormData({ kodeKegiatan: "", namaKegiatan: "", bidang: "", anggaran: "" });
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="kodeKegiatan">Kode Kegiatan</Label>
                    <Input
                      id="kodeKegiatan"
                      value={formData.kodeKegiatan}
                      onChange={(e) => setFormData({...formData, kodeKegiatan: e.target.value})}
                      placeholder="Contoh: 01.3.02.03"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="namaKegiatan">Nama Kegiatan</Label>
                    <Input
                      id="namaKegiatan"
                      value={formData.namaKegiatan}
                      onChange={(e) => setFormData({...formData, namaKegiatan: e.target.value})}
                      placeholder="Masukkan nama kegiatan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bidang">Bidang Kegiatan</Label>
                    <Input
                      id="bidang"
                      value={formData.bidang}
                      onChange={(e) => setFormData({...formData, bidang: e.target.value})}
                      placeholder="Contoh: KURIKULUM"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="anggaran">Anggaran</Label>
                    <Input
                      id="anggaran"
                      type="number"
                      value={formData.anggaran}
                      onChange={(e) => setFormData({...formData, anggaran: e.target.value})}
                      placeholder="Masukkan jumlah anggaran"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Simpan
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <Input
                type="text"
                placeholder="Cari kegiatan..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2" size={18} />
              Filter
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
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-900">01.3.02.01</td>
                      <td className="py-3 px-4 text-slate-900">Pengembangan Perpustakaan</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          KURIKULUM
                        </span>
                      </td>
                      <td className="py-3 px-4 text-green-600 font-medium">Rp 100,000,000</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Draft
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-900">02.3.02.02</td>
                      <td className="py-3 px-4 text-slate-900">Pelatihan Ekstrakurikuler</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                          KESISWAAN
                        </span>
                      </td>
                      <td className="py-3 px-4 text-green-600 font-medium">Rp 30,000,000</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Approved
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
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