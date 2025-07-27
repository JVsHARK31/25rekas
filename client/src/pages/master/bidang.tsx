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
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { mockAPI, initializeMockData } from "@/lib/mock-data";

export default function BidangKegiatan() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bidangData, setBidangData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    kode_bidang: "",
    nama_bidang: "",
    deskripsi: ""
  });

  useEffect(() => {
    initializeMockData();
    loadBidangData();
  }, []);

  useEffect(() => {
    const filtered = bidangData.filter((item: any) => 
      item.kode_bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_bidang.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [bidangData, searchTerm]);

  const loadBidangData = async () => {
    try {
      setLoading(true);
      const data = mockAPI.getBidang();
      setBidangData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error loading bidang data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data bidang kegiatan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mockAPI.addBidang(formData);
      toast({
        title: "Berhasil",
        description: "Bidang kegiatan berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      setFormData({ kode_bidang: "", nama_bidang: "", deskripsi: "" });
      loadBidangData();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Gagal menambahkan bidang kegiatan",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      kode_bidang: item.kode_bidang,
      nama_bidang: item.nama_bidang,
      deskripsi: item.deskripsi || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    try {
      await mockAPI.updateBidang(selectedItem.id, formData);
      toast({
        title: "Berhasil",
        description: "Bidang kegiatan berhasil diperbarui",
      });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      setFormData({ kode_bidang: "", nama_bidang: "", deskripsi: "" });
      loadBidangData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui bidang kegiatan",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus bidang kegiatan ini?")) return;
    
    try {
      await mockAPI.deleteBidang(id);
      toast({
        title: "Berhasil",
        description: "Bidang kegiatan berhasil dihapus",
      });
      loadBidangData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus bidang kegiatan",
        variant: "destructive",
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex h-[calc(100vh-80px)]">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="erkas-loading h-8 w-8" />
          </main>
        </div>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Bidang Kegiatan</h2>
              <p className="text-slate-600">Kelola bidang kegiatan RKAS</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Bidang
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Bidang Kegiatan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="kodeBidang">Kode Bidang</Label>
                    <Input
                      id="kodeBidang"
                      value={formData.kode_bidang}
                      onChange={(e) => setFormData({...formData, kode_bidang: e.target.value})}
                      placeholder="Contoh: 06"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="namaBidang">Nama Bidang</Label>
                    <Input
                      id="namaBidang"
                      value={formData.nama_bidang}
                      onChange={(e) => setFormData({...formData, nama_bidang: e.target.value})}
                      placeholder="Masukkan nama bidang"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Input
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      placeholder="Masukkan deskripsi bidang"
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

          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <Input
                type="text"
                placeholder="Cari bidang kegiatan..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Bidang Kegiatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Kode</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Nama Bidang</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Deskripsi</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item: any) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">{item.kode_bidang}</td>
                        <td className="py-3 px-4 text-slate-900">{item.nama_bidang}</td>
                        <td className="py-3 px-4 text-slate-600">{item.deskripsi || "-"}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Aktif
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(item.id)}
                            >
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

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Bidang Kegiatan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="editKodeBidang">Kode Bidang</Label>
                  <Input
                    id="editKodeBidang"
                    value={formData.kode_bidang}
                    onChange={(e) => setFormData({...formData, kode_bidang: e.target.value})}
                    placeholder="Contoh: 06"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editNamaBidang">Nama Bidang</Label>
                  <Input
                    id="editNamaBidang"
                    value={formData.nama_bidang}
                    onChange={(e) => setFormData({...formData, nama_bidang: e.target.value})}
                    placeholder="Masukkan nama bidang"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editDeskripsi">Deskripsi</Label>
                  <Input
                    id="editDeskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    placeholder="Masukkan deskripsi bidang"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Update
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

        </main>
      </div>
    </div>
  );
}