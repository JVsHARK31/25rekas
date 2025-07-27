"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Calculator, Edit, Trash2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AddRekeningDialog } from "@/components/master/add-rekening-dialog"
import { EditRekeningDialog } from "@/components/master/edit-rekening-dialog"
import { DeleteConfirmDialog } from "@/components/rkas/delete-confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function MasterRekeningPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [rekeningData, setRekeningData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
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

      await loadRekeningData()
      setLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const filtered = rekeningData.filter(
      (item) =>
        item.kode_rekening.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_rekening.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredData(filtered)
  }, [rekeningData, searchTerm])

  const loadRekeningData = async () => {
    try {
      const { data, error } = await supabase.from("rkas_rekening").select("*").order("kode_rekening")

      if (error) {
        console.log("Error loading rekening data:", error)
      }

      if (data) {
        setRekeningData(data)
        setFilteredData(data)
      }
    } catch (error) {
      console.error("Error loading rekening data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data rekening",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (kodeRekening: string) => {
    try {
      const { error } = await supabase.from("rkas_rekening").delete().eq("kode_rekening", kodeRekening)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Data rekening berhasil dihapus",
      })

      loadRekeningData()
      setShowDeleteDialog(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Error deleting rekening:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus data rekening",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6 p-2 sm:p-0">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Master Data Rekening</h1>
                <p className="text-sm sm:text-base text-gray-600">Kelola data rekening anggaran</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Rekening
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari rekening..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Rekening</p>
                <p className="text-2xl font-bold text-purple-600">{rekeningData.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Rekening Aktif</p>
                <p className="text-2xl font-bold text-green-600">{rekeningData.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Hasil Pencarian</p>
                <p className="text-2xl font-bold text-blue-600">{filteredData.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Rekening Anggaran</CardTitle>
            <CardDescription>Kode rekening untuk klasifikasi belanja</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
              {filteredData.map((rekening, index) => (
                <Card key={rekening.kode_rekening || index} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="font-mono text-xs font-bold">{rekening.kode_rekening}</div>
                        <div className="font-medium text-sm">{rekening.nama_rekening}</div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">{rekening.kategori}</Badge>
                          <Badge variant="default">Aktif</Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(rekening)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(rekening)
                              setShowDeleteDialog(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Kode Rekening</TableHead>
                    <TableHead>Nama Rekening</TableHead>
                    <TableHead className="w-[150px]">Kategori</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((rekening, index) => (
                    <TableRow key={rekening.kode_rekening || index}>
                      <TableCell className="font-mono text-sm font-bold">{rekening.kode_rekening}</TableCell>
                      <TableCell className="font-medium">{rekening.nama_rekening}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rekening.kategori}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Aktif</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(rekening)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(rekening)
                              setShowDeleteDialog(true)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Tidak ada data rekening</h3>
                <p className="text-sm">Tambahkan rekening baru atau ubah kata kunci pencarian</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AddRekeningDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={loadRekeningData} />

        <EditRekeningDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          item={selectedItem}
          onSuccess={loadRekeningData}
        />

        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => selectedItem && handleDelete(selectedItem.kode_rekening)}
          title="Hapus Data Rekening"
          description={`Apakah Anda yakin ingin menghapus rekening "${selectedItem?.nama_rekening}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </DashboardLayout>
  )
}
