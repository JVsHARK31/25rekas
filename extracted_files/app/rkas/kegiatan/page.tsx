"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RKASKegiatanTable } from "@/components/rkas/rkas-kegiatan-table"
import { RKASFilters } from "@/components/rkas/rkas-filters"
import { RKASActions } from "@/components/rkas/rkas-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Download, Upload, RefreshCw } from "lucide-react"
import { AddRKASDialog } from "@/components/rkas/add-rkas-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function RKASKegiatanPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [rkasData, setRkasData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
    totalBudget: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/")
          return
        }

        setUser(user)

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profile)

        await loadRKASData()
      } catch (error) {
        console.error("Auth error:", error)
        toast({
          title: "Error",
          description: "Gagal memuat data pengguna",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadRKASData = async () => {
    try {
      setRefreshing(true)
      const { data, error } = await supabase
        .from("rkas_activities")
        .select(`
          *,
          rkas_bidang(nama_bidang),
          rkas_standar(nama_standar),
          rkas_dana(nama_dana)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      if (data) {
        setRkasData(data)
        setFilteredData(data)
        calculateStats(data)

        toast({
          title: "Berhasil",
          description: `${data.length} kegiatan berhasil dimuat`,
        })
      }
    } catch (error) {
      console.error("Error loading RKAS data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data RKAS",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      draft: data.filter((item) => item.status === "draft").length,
      submitted: data.filter((item) => item.status === "submitted").length,
      approved: data.filter((item) => item.status === "approved").length,
      rejected: data.filter((item) => item.status === "rejected").length,
      totalBudget: data.reduce(
        (sum, item) => sum + (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0),
        0,
      ),
    }
    setStats(stats)
  }

  const handleFilter = useCallback(
    (filters) => {
      let filtered = [...rkasData]

      if (filters.bidang && filters.bidang !== "all") {
        filtered = filtered.filter((item) => item.kode_bidang === filters.bidang)
      }

      if (filters.year && filters.year !== "all") {
        filtered = filtered.filter((item) => item.tahun === Number.parseInt(filters.year))
      }

      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((item) => item.status === filters.status)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.nama_giat?.toLowerCase().includes(searchLower) ||
            item.subtitle?.toLowerCase().includes(searchLower) ||
            item.kode_giat?.toLowerCase().includes(searchLower) ||
            item.rkas_bidang?.nama_bidang?.toLowerCase().includes(searchLower),
        )
      }

      setFilteredData(filtered)
      calculateStats(filtered)
    },
    [rkasData],
  )

  const handleAddSuccess = useCallback(() => {
    loadRKASData()
    setShowAddDialog(false)
    toast({
      title: "Berhasil",
      description: "Kegiatan RKAS berhasil ditambahkan",
    })
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Memuat data kegiatan RKAS...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6 p-2 sm:p-0">
        {/* Header Section - Responsive */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Input Kegiatan RKAS</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Kelola data kegiatan Rencana Kegiatan dan Anggaran Sekolah
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={loadRKASData}
              disabled={refreshing}
              className="w-full sm:w-auto bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="sm:inline">Tambah Kegiatan</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-blue-600">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Draft</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">{stats.draft}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-yellow-600">Diajukan</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-800">{stats.submitted}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-green-600">Disetujui</p>
                <p className="text-lg sm:text-2xl font-bold text-green-800">{stats.approved}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-red-600">Ditolak</p>
                <p className="text-lg sm:text-2xl font-bold text-red-800">{stats.rejected}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 col-span-2 sm:col-span-3 lg:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-purple-600">Total Anggaran</p>
                <p className="text-sm sm:text-lg font-bold text-purple-800">{formatCurrency(stats.totalBudget)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert - Responsive */}
        <Alert className="border-green-200 bg-green-50">
          <FileText className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <span>
                <strong>Sistem RKAS:</strong> Kelola kegiatan sesuai 8 standar nasional pendidikan
              </span>
              <Badge variant="outline" className="bg-white text-green-700 w-fit">
                Tahun Anggaran 2025
              </Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* Main Content Tabs - Responsive */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-3">
            <TabsTrigger value="table" className="text-xs sm:text-sm">
              <FileText className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Tabel </span>Data
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs sm:text-sm">
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Info </span>Bidang
            </TabsTrigger>
            <TabsTrigger value="import" className="text-xs sm:text-sm">
              <Upload className="w-4 h-4 mr-1 sm:mr-2" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4">
            {/* Filters */}
            <RKASFilters onFilter={handleFilter} />

            {/* Actions */}
            <RKASActions data={filteredData} />

            {/* Table */}
            <RKASKegiatanTable data={filteredData} onDataChange={loadRKASData} />
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 text-lg">Bidang Kegiatan RKAS</CardTitle>
                  <CardDescription className="text-green-700">
                    8 Bidang sesuai Standar Nasional Pendidikan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-green-800">
                    {[
                      { kode: "01", nama: "Kurikulum" },
                      { kode: "02", nama: "Kesiswaan" },
                      { kode: "03", nama: "Sarana dan Prasarana" },
                      { kode: "04", nama: "Pendidik dan Tenaga Kependidikan" },
                      { kode: "05", nama: "Pembiayaan" },
                      { kode: "06", nama: "Budaya dan Lingkungan Sekolah" },
                      { kode: "07", nama: "Peran Serta Masyarakat dan Kemitraan" },
                      { kode: "08", nama: "Rencana Kerja dan Evaluasi Sekolah" },
                    ].map((bidang) => (
                      <div key={bidang.kode} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="font-medium">{bidang.kode}</span>
                        <span className="text-xs sm:text-sm">{bidang.nama}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-lg">Sumber Dana</CardTitle>
                  <CardDescription className="text-blue-700">Sumber pendanaan kegiatan RKAS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-blue-800">
                    {[
                      { kode: "3.02.01", nama: "BOP Alokasi Dasar" },
                      { kode: "3.02.02", nama: "BOP Kinerja" },
                      { kode: "3.01.01", nama: "BOS Pusat" },
                      { kode: "3.02.05", nama: "DAK Fisik" },
                      { kode: "3.02.06", nama: "DAK Non Fisik" },
                      { kode: "3.02.07", nama: "Bantuan Pemerintah Daerah" },
                    ].map((dana) => (
                      <div key={dana.kode} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="font-mono text-xs">{dana.kode}</span>
                        <span className="text-xs sm:text-sm">{dana.nama}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Import Data RKAS
                </CardTitle>
                <CardDescription>Upload file Excel untuk import data kegiatan RKAS secara massal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Import Data Excel</h3>
                  <p className="text-sm mb-4">Fitur import data akan segera tersedia</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                    <Button disabled className="w-full sm:w-auto">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Dialog */}
        <AddRKASDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={handleAddSuccess} />
      </div>
    </DashboardLayout>
  )
}
