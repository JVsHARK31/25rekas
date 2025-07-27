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
import { Plus, Search, Edit, Trash2, DollarSign } from "lucide-react";

export default function RincianAnggaran() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    kodeRincian: "",
    namaRincian: "",
    jumlahAnggaran: "",
    keterangan: ""
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
    setFormData({ kodeRincian: "", namaRincian: "", jumlahAnggaran: "", keterangan: "" });
  };

  const sampleData = [
    { id: 1, kode: "RD001", nama: "Biaya Operasional Pembelajaran", anggaran: "150000000", keterangan: "Biaya rutin pembelajaran" },
    { id: 2, kode: "RD002", nama: "Pengembangan Sarana Prasarana", anggaran: "200000000", keterangan: "Pemeliharaan dan pengembangan" },
    { id: 3, kode: "RD003", nama: "Kegiatan Ekstrakurikuler", anggaran: "75000000", keterangan: "Program pengembangan siswa" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Rincian Anggaran</h2>
              <p className="text-slate-600">Kelola rincian anggaran RKAS per kegiatan</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Rincian
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Rincian Anggaran</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="kodeRincian">Kode Rincian</Label>
                    <Input
                      id="kodeRincian"
                      value={formData.kodeRincian}
                      onChange={(e) => setFormData({...formData, kodeRincian: e.target.value})}
                      placeholder="Masukkan kode rincian"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="namaRincian">Nama Rincian</Label>
                    <Input
                      id="namaRincian"
                      value={formData.namaRincian}
                      onChange={(e) => setFormData({...formData, namaRincian: e.target.value})}
                      placeholder="Masukkan nama rincian"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="jumlahAnggaran">Jumlah Anggaran</Label>
                    <Input
                      id="jumlahAnggaran"
                      type="number"
                      value={formData.jumlahAnggaran}
                      onChange={(e) => setFormData({...formData, jumlahAnggaran: e.target.value})}
                      placeholder="Masukkan jumlah anggaran"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Input
                      id="keterangan"
                      value={formData.keterangan}
                      onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                      placeholder="Masukkan keterangan"
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

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <Input
                type="text"
                placeholder="Cari rincian anggaran..."
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Rincian Anggaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Kode</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Nama Rincian</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Jumlah Anggaran</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Keterangan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">{item.kode}</td>
                        <td className="py-3 px-4 text-slate-900">{item.nama}</td>
                        <td className="py-3 px-4 text-green-600 font-medium">
                          Rp {parseInt(item.anggaran).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{item.keterangan}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 size={14} />
                            </Button>
                          </div>
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