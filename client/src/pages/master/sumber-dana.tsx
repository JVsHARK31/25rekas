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

export default function SumberDana() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    kodeDana: "",
    namaDana: "",
    sumberDana: "",
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
    setFormData({ kodeDana: "", namaDana: "", sumberDana: "", keterangan: "" });
  };

  const sampleData = [
    { id: 1, kode: "3.02.01", nama: "BOS Reguler", sumber: "APBN", keterangan: "Bantuan Operasional Sekolah Reguler" },
    { id: 2, kode: "3.02.02", nama: "BOS Kinerja", sumber: "APBN", keterangan: "Bantuan Operasional Sekolah Kinerja" },
    { id: 3, kode: "3.02.03", nama: "Dana Bantuan Provinsi", sumber: "APBD Provinsi", keterangan: "Dana bantuan dari Pemerintah Provinsi DKI Jakarta" },
    { id: 4, kode: "3.02.04", nama: "Iuran Komite Sekolah", sumber: "Masyarakat", keterangan: "Iuran dari komite sekolah dan orang tua siswa" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sumber Dana</h2>
              <p className="text-slate-600">Kelola sumber pendanaan sekolah</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Sumber Dana
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Sumber Dana</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="kodeDana">Kode Dana</Label>
                    <Input
                      id="kodeDana"
                      value={formData.kodeDana}
                      onChange={(e) => setFormData({...formData, kodeDana: e.target.value})}
                      placeholder="Contoh: 3.02.05"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="namaDana">Nama Dana</Label>
                    <Input
                      id="namaDana"
                      value={formData.namaDana}
                      onChange={(e) => setFormData({...formData, namaDana: e.target.value})}
                      placeholder="Masukkan nama dana"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sumberDana">Sumber Dana</Label>
                    <Input
                      id="sumberDana"
                      value={formData.sumberDana}
                      onChange={(e) => setFormData({...formData, sumberDana: e.target.value})}
                      placeholder="Contoh: APBN, APBD, Masyarakat"
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
              <CardTitle>Daftar Sumber Dana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Kode</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Nama Dana</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Sumber</th>
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
                            item.sumber === 'APBN' ? 'bg-blue-100 text-blue-800' :
                            item.sumber === 'APBD Provinsi' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.sumber}
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