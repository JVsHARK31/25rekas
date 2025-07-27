"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Building, Edit, Trash2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AddKomponenDialog } from "@/components/master/add-komponen-dialog"
import { EditKomponenDialog } from "@/components/master/edit-komponen-dialog"
import { DeleteConfirmDialog } from "@/components/rkas/delete-confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function MasterKomponenPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [komponenData, setKomponenData] = useState([])
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

      await loadKomponenData()
      setLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const filtered = komponenData.filter(
      (item) =>
        item.kode_komponen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_komponen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredData(filtered)
  }, [komponenData, searchTerm])

  const loadKomponenData = async () => {
    try {
      const { data, error } = await supabase.from("rkas_komponen").select("*").order("kode_komponen")

      if (error) {
        console.log("Error loading komponen data:", error)
      }

      if (data) {
        setKomponenData(data)
        setFilteredData(data)
      }
    } catch (error) {
      console.error("Error loading komponen data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data komponen",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (kodeKomponen: string) => {
    try {
      const { error } = await supabase.from("rkas_komponen").delete().eq("kode_komponen", kodeKomponen)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Data komponen berhasil dihapus",
      })

      loadKomponenData()
      setShowDeleteDialog(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Error deleting komponen:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus data komponen",
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Master Data Komponen</h1>
                <p className="text-sm sm:text-base text-gray-600">Kelola data komponen belanja</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Komponen
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari komponen..."
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
                <p className="text-sm font-medium text-gray-600">Total Komponen</p>
                <p className="text-2xl font-bold text-orange-600">{komponenData.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Komponen Aktif</p>
                <p className="text-2xl font-bold text-green-600">{komponenData.length}</p>
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
            <CardTitle>Daftar Komponen Belanja</CardTitle>
            <CardDescription>Komponen detail untuk rincian anggaran</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
              {filteredData.map((komponen, index) => (
                <Card key={komponen.kode_komponen || index} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="font-mono text-xs font-bold">{komponen.kode_komponen}</div>
                        <div className="font-medium text-sm">{komponen.nama_komponen}</div>
                        <div className="flex space-x-2">
                          <Badge variant="secondary">{komponen.satuan}</Badge>
                          <Badge variant="outline">{komponen.kategori}</Badge>
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
                              setSelectedItem(komponen)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(komponen)
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
                    <TableHead className="w-[250px]">Kode Komponen</TableHead>
                    <TableHead>Nama Komponen</TableHead>
                    <TableHead className="w-[100px]">Satuan</TableHead>
                    <TableHead className="w-[120px]">Kategori</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((komponen, index) => (
                    <TableRow key={komponen.kode_komponen || index}>
                      <TableCell className="font-mono text-xs font-bold">{komponen.kode_komponen}</TableCell>
                      <TableCell className="font-medium">{komponen.nama_komponen}</TableCell>
                      <TableCell>{komponen.satuan}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{komponen.kategori}</Badge>
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
                              setSelectedItem(komponen)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(komponen)
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
                <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Tidak ada data komponen</h3>
                <p className="text-sm">Tambahkan komponen baru atau ubah kata kunci pencarian</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AddKomponenDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={loadKomponenData} />

        <EditKomponenDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          item={selectedItem}
          onSuccess={loadKomponenData}
        />

        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => selectedItem && handleDelete(selectedItem.kode_komponen)}
          title="Hapus Data Komponen"
          description={`Apakah Anda yakin ingin menghapus komponen "${selectedItem?.nama_komponen}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </DashboardLayout>
  )
}
