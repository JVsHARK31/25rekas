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
import { Plus, Search, Edit, Trash2, Box } from "lucide-react";

export default function Komponen() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    kodeKomponen: "",
    namaKomponen: "",
    satuan: "",
    hargaSatuan: "",
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
    setFormData({ kodeKomponen: "", namaKomponen: "", satuan: "", hargaSatuan: "", keterangan: "" });
  };

  const sampleData = [
    { id: 1, kode: "KMP001", nama: "Alat Tulis Kantor", satuan: "Paket", harga: "250000", keterangan: "ATK untuk administrasi sekolah" },
    { id: 2, kode: "KMP002", nama: "Buku Pelajaran", satuan: "Eksemplar", harga: "75000", keterangan: "Buku pelajaran untuk siswa" },
    { id: 3, kode: "KMP003", nama: "Komputer Desktop", satuan: "Unit", harga: "8500000", keterangan: "Komputer untuk laboratorium" },
    { id: 4, kode: "KMP004", nama: "Meja Siswa", satuan: "Unit", harga: "450000", keterangan: "Meja untuk ruang kelas" },
    { id: 5, kode: "KMP005", nama: "Proyektor", satuan: "Unit", harga: "3500000", keterangan: "Proyektor untuk pembelajaran" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Komponen</h2>
              <p className="text-slate-600">Kelola komponen dan item anggaran</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Komponen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Komponen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="kodeKomponen">Kode Komponen</Label>
                    <Input
                      id="kodeKomponen"
                      value={formData.kodeKomponen}
                      onChange={(e) => setFormData({...formData, kodeKomponen: e.target.value})}
                      placeholder="Contoh: KMP006"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="namaKomponen">Nama Komponen</Label>
                    <Input
                      id="namaKomponen"
                      value={formData.namaKomponen}
                      onChange={(e) => setFormData({...formData, namaKomponen: e.target.value})}
                      placeholder="Masukkan nama komponen"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="satuan">Satuan</Label>
                    <Input
                      id="satuan"
                      value={formData.satuan}
                      onChange={(e) => setFormData({...formData, satuan: e.target.value})}
                      placeholder="Contoh: Unit, Paket, Buah"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hargaSatuan">Harga Satuan</Label>
                    <Input
                      id="hargaSatuan"
                      type="number"
                      value={formData.hargaSatuan}
                      onChange={(e) => setFormData({...formData, hargaSatuan: e.target.value})}
                      placeholder="Masukkan harga satuan"
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

          <Card>
            <CardHeader>
              <CardTitle>Daftar Komponen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Kode</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Nama Komponen</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Satuan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Harga Satuan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Keterangan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">{item.kode}</td>
                        <td className="py-3 px-4 text-slate-900">{item.nama}</td>
                        <td className="py-3 px-4 text-slate-600">{item.satuan}</td>
                        <td className="py-3 px-4 text-green-600 font-medium">
                          Rp {parseInt(item.harga).toLocaleString('id-ID')}
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