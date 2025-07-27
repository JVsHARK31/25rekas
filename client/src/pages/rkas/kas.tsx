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
import { Plus, Search, Edit, Trash2, CreditCard } from "lucide-react";

export default function AnggaranKas() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    bulan: "",
    jenisKas: "",
    pemasukan: "",
    pengeluaran: "",
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
    setFormData({ bulan: "", jenisKas: "", pemasukan: "", pengeluaran: "", keterangan: "" });
  };

  const sampleData = [
    { id: 1, bulan: "Januari 2025", jenis: "BOS Reguler", pemasukan: "500000000", pengeluaran: "350000000", saldo: "150000000" },
    { id: 2, bulan: "Februari 2025", jenis: "BOS Kinerja", pemasukan: "200000000", pengeluaran: "180000000", saldo: "20000000" },
    { id: 3, bulan: "Maret 2025", jenis: "Dana Bantuan", pemasukan: "100000000", pengeluaran: "75000000", saldo: "25000000" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Anggaran Kas</h2>
              <p className="text-slate-600">Kelola arus kas dan likuiditas sekolah</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Kas
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Data Kas</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="bulan">Periode Bulan</Label>
                    <Select value={formData.bulan} onValueChange={(value) => setFormData({...formData, bulan: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="januari-2025">Januari 2025</SelectItem>
                        <SelectItem value="februari-2025">Februari 2025</SelectItem>
                        <SelectItem value="maret-2025">Maret 2025</SelectItem>
                        <SelectItem value="april-2025">April 2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="jenisKas">Jenis Kas</Label>
                    <Select value={formData.jenisKas} onValueChange={(value) => setFormData({...formData, jenisKas: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bos-reguler">BOS Reguler</SelectItem>
                        <SelectItem value="bos-kinerja">BOS Kinerja</SelectItem>
                        <SelectItem value="dana-bantuan">Dana Bantuan</SelectItem>
                        <SelectItem value="iuran-komite">Iuran Komite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pemasukan">Pemasukan</Label>
                    <Input
                      id="pemasukan"
                      type="number"
                      value={formData.pemasukan}
                      onChange={(e) => setFormData({...formData, pemasukan: e.target.value})}
                      placeholder="Masukkan jumlah pemasukan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pengeluaran">Pengeluaran</Label>
                    <Input
                      id="pengeluaran"
                      type="number"
                      value={formData.pengeluaran}
                      onChange={(e) => setFormData({...formData, pengeluaran: e.target.value})}
                      placeholder="Masukkan jumlah pengeluaran"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Pemasukan</p>
                    <div className="text-2xl font-bold text-green-600">
                      Rp 800,000,000
                    </div>
                  </div>
                  <CreditCard className="text-green-600" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Pengeluaran</p>
                    <div className="text-2xl font-bold text-red-600">
                      Rp 605,000,000
                    </div>
                  </div>
                  <CreditCard className="text-red-600" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Saldo Kas</p>
                    <div className="text-2xl font-bold text-blue-600">
                      Rp 195,000,000
                    </div>
                  </div>
                  <CreditCard className="text-blue-600" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Laporan Arus Kas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Periode</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Jenis Kas</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Pemasukan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Pengeluaran</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Saldo</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">{item.bulan}</td>
                        <td className="py-3 px-4 text-slate-900">{item.jenis}</td>
                        <td className="py-3 px-4 text-green-600 font-medium">
                          Rp {parseInt(item.pemasukan).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-red-600 font-medium">
                          Rp {parseInt(item.pengeluaran).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-blue-600 font-medium">
                          Rp {parseInt(item.saldo).toLocaleString('id-ID')}
                        </td>
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