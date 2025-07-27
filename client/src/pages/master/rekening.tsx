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
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react";

export default function Rekening() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    kodeRekening: "",
    namaRekening: "",
    jenisRekening: "",
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
    setFormData({ kodeRekening: "", namaRekening: "", jenisRekening: "", keterangan: "" });
  };

  const sampleData = [
    { id: 1, kode: "5.2.01", nama: "Belanja Pegawai", jenis: "Belanja Langsung", keterangan: "Belanja untuk pembayaran gaji dan tunjangan" },
    { id: 2, kode: "5.2.02", nama: "Belanja Barang dan Jasa", jenis: "Belanja Langsung", keterangan: "Belanja untuk kebutuhan operasional" },
    { id: 3, kode: "5.2.03", nama: "Belanja Modal", jenis: "Belanja Langsung", keterangan: "Belanja untuk pengadaan aset tetap" },
    { id: 4, kode: "5.1.01", nama: "Belanja Operasi", jenis: "Belanja Tidak Langsung", keterangan: "Belanja untuk operasional rutin" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Rekening</h2>
              <p className="text-slate-600">Kelola kode rekening anggaran</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Rekening
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Rekening</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="kodeRekening">Kode Rekening</Label>
                    <Input
                      id="kodeRekening"
                      value={formData.kodeRekening}
                      onChange={(e) => setFormData({...formData, kodeRekening: e.target.value})}
                      placeholder="Contoh: 5.2.04"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="namaRekening">Nama Rekening</Label>
                    <Input
                      id="namaRekening"
                      value={formData.namaRekening}
                      onChange={(e) => setFormData({...formData, namaRekening: e.target.value})}
                      placeholder="Masukkan nama rekening"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="jenisRekening">Jenis Rekening</Label>
                    <Input
                      id="jenisRekening"
                      value={formData.jenisRekening}
                      onChange={(e) => setFormData({...formData, jenisRekening: e.target.value})}
                      placeholder="Contoh: Belanja Langsung"
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
              <CardTitle>Daftar Rekening</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Kode</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Nama Rekening</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Jenis</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Keterangan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">{item.kode}</td>
                        <td className="py-3 px-4 text-slate-900">{item.nama}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.jenis === 'Belanja Langsung' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.jenis}
                          </span>
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