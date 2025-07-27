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
import { Plus, Search, Edit, Target, TrendingUp, CheckCircle } from "lucide-react";

export default function RealisasiRKAS() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    kegiatan: "",
    targetAnggaran: "",
    realisasi: "",
    tanggal: "",
    bukti: ""
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsDialogOpen(false);
    setFormData({ kegiatan: "", targetAnggaran: "", realisasi: "", tanggal: "", bukti: "" });
  };

  const sampleData = [
    { 
      id: 1, 
      kegiatan: "Pengembangan Perpustakaan", 
      target: "100000000", 
      realisasi: "85000000", 
      persentase: 85,
      status: "Dalam Proses",
      tanggal: "2025-01-15"
    },
    { 
      id: 2, 
      kegiatan: "Pelatihan Guru Kurikulum", 
      target: "30000000", 
      realisasi: "30000000", 
      persentase: 100,
      status: "Selesai",
      tanggal: "2025-01-10"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Realisasi RKAS</h2>
              <p className="text-slate-600">Monitor dan catat realisasi anggaran kegiatan</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Realisasi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Realisasi Anggaran</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="kegiatan">Nama Kegiatan</Label>
                    <Input
                      id="kegiatan"
                      value={formData.kegiatan}
                      onChange={(e) => setFormData({...formData, kegiatan: e.target.value})}
                      placeholder="Masukkan nama kegiatan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetAnggaran">Target Anggaran</Label>
                    <Input
                      id="targetAnggaran"
                      type="number"
                      value={formData.targetAnggaran}
                      onChange={(e) => setFormData({...formData, targetAnggaran: e.target.value})}
                      placeholder="Masukkan target anggaran"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="realisasi">Jumlah Realisasi</Label>
                    <Input
                      id="realisasi"
                      type="number"
                      value={formData.realisasi}
                      onChange={(e) => setFormData({...formData, realisasi: e.target.value})}
                      placeholder="Masukkan jumlah realisasi"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tanggal">Tanggal Realisasi</Label>
                    <Input
                      id="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bukti">Nomor Bukti</Label>
                    <Input
                      id="bukti"
                      value={formData.bukti}
                      onChange={(e) => setFormData({...formData, bukti: e.target.value})}
                      placeholder="Masukkan nomor bukti/kwitansi"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Target</p>
                    <div className="text-2xl font-bold text-blue-600">
                      Rp 130,000,000
                    </div>
                  </div>
                  <Target className="text-blue-600" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Realisasi</p>
                    <div className="text-2xl font-bold text-green-600">
                      Rp 115,000,000
                    </div>
                  </div>
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Persentase Capaian</p>
                    <div className="text-2xl font-bold text-purple-600">
                      88.5%
                    </div>
                  </div>
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Realisasi Anggaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Kegiatan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Target</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Realisasi</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Persentase</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Tanggal</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-900">{item.kegiatan}</td>
                        <td className="py-3 px-4 text-slate-600">
                          Rp {parseInt(item.target).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-green-600 font-medium">
                          Rp {parseInt(item.realisasi).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{width: `${item.persentase}%`}}
                              />
                            </div>
                            <span className="text-sm font-medium">{item.persentase}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'Selesai' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{item.tanggal}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            <Edit size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
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