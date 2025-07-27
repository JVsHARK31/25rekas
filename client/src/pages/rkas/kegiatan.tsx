import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";

export default function KegiatanRKAS() {
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
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2" size={18} />
              Tambah Kegiatan
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <div className="text-center py-12">
                <div className="text-4xl text-slate-300 mb-4">📋</div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">Belum ada kegiatan</h3>
                <p className="text-slate-500 mb-4">Mulai dengan menambahkan kegiatan RKAS pertama Anda</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2" size={18} />
                  Tambah Kegiatan
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}