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
import { Plus, Search, Edit, Trash2, Globe } from "lucide-react";

export default function StandarNasional() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    bidangId: "",
    kodeStandar: "",
    namaStandar: "",
    deskripsi: ""
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
    setFormData({ bidangId: "", kodeStandar: "", namaStandar: "", deskripsi: "" });
  };

  const sampleData = [
    { id: 1, bidang: "KURIKULUM", kode: "1.1", nama: "Standar Kompetensi Lulusan", deskripsi: "Kriteria mengenai kualifikasi kemampuan lulusan" },
    { id: 2, bidang: "KURIKULUM", kode: "1.2", nama: "Standar Isi", deskripsi: "Ruang lingkup materi dan tingkat kompetensi" },
    { id: 3, bidang: "KESISWAAN", kode: "2.1", nama: "Standar Proses", deskripsi: "Standar nasional pendidikan yang berkaitan dengan pelaksanaan pembelajaran" },
    { id: 4, bidang: "SARANA & PRASARANA", kode: "3.1", nama: "Standar Sarana dan Prasarana", deskripsi: "Standar nasional pendidikan yang berkaitan dengan kriteria minimal sarana dan prasarana" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Standar Nasional</h2>
              <p className="text-slate-600">Kelola standar nasional pendidikan</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Standar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Standar Nasional</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="bidangId">Bidang Kegiatan</Label>
                    <Select value={formData.bidangId} onValueChange={(value) => setFormData({...formData, bidangId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bidang kegiatan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">01 - KURIKULUM</SelectItem>
                        <SelectItem value="02">02 - KESISWAAN</SelectItem>
                        <SelectItem value="03">03 - SARANA & PRASARANA</SelectItem>
                        <SelectItem value="04">04 - HUMAS & KEHUMASAN</SelectItem>
                        <SelectItem value="05">05 - TATA USAHA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="kodeStandar">Kode Standar</Label>
                    <Input
                      id="kodeStandar"
                      value={formData.kodeStandar}
                      onChange={(e) => setFormData({...formData, kodeStandar: e.target.value})}
                      placeholder="Contoh: 1.1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="namaStandar">Nama Standar</Label>
                    <Input
                      id="namaStandar"
                      value={formData.namaStandar}
                      onChange={(e) => setFormData({...formData, namaStandar: e.target.value})}
                      placeholder="Masukkan nama standar"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Input
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      placeholder="Masukkan deskripsi standar"
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
                placeholder="Cari standar nasional..."
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Standar Nasional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Bidang</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Kode</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Nama Standar</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Deskripsi</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {item.bidang}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">{item.kode}</td>
                        <td className="py-3 px-4 text-slate-900">{item.nama}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{item.deskripsi}</td>
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