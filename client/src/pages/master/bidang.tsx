import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default function BidangKegiatan() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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

  const sampleData = [
    { id: 1, kode: "01", nama: "KURIKULUM", jumlahStandar: 8, status: "Aktif" },
    { id: 2, kode: "02", nama: "KESISWAAN", jumlahStandar: 5, status: "Aktif" },
    { id: 3, kode: "03", nama: "SARANA & PRASARANA", jumlahStandar: 12, status: "Aktif" },
    { id: 4, kode: "04", nama: "HUMAS & KEHUMASAN", jumlahStandar: 3, status: "Aktif" },
    { id: 5, kode: "05", nama: "TATA USAHA", jumlahStandar: 7, status: "Aktif" },
  ];

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
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2" size={18} />
              Tambah Bidang
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Cari bidang kegiatan..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Jumlah Standar</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">{item.kode}</td>
                        <td className="py-3 px-4 text-slate-900">{item.nama}</td>
                        <td className="py-3 px-4 text-slate-600">{item.jumlahStandar}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            {item.status}
                          </span>
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