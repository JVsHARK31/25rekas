"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase, Edit, Trash2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AddBidangDialog } from "@/components/master/add-bidang-dialog"
import { EditBidangDialog } from "@/components/master/edit-bidang-dialog"
import { DeleteConfirmDialog } from "@/components/rkas/delete-confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function MasterBidangPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [bidangData, setBidangData] = useState([])
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

      await loadBidangData()
      setLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const filtered = bidangData.filter(
      (item) =>
        item.kode_bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_bidang.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredData(filtered)
  }, [bidangData, searchTerm])

  const loadBidangData = async () => {
    try {
      const { data, error } = await supabase.from("rkas_bidang").select("*").order("kode_bidang")

      if (error) throw error

      if (data) {
        setBidangData(data)
        setFilteredData(data)
      }
    } catch (error) {
      console.error("Error loading bidang data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data bidang",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (kodeBidang: string) => {
    try {
      const { error } = await supabase.from("rkas_bidang").delete().eq("kode_bidang", kodeBidang)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Data bidang berhasil dihapus",
      })

      loadBidangData()
      setShowDeleteDialog(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Error deleting bidang:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus data bidang",
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
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Master Data Bidang</h1>
                <p className="text-sm sm:text-base text-gray-600">Kelola data bidang kegiatan RKAS</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Bidang
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari bidang..."
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
                <p className="text-sm font-medium text-gray-600">Total Bidang</p>
                <p className="text-2xl font-bold text-green-600">{bidangData.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Bidang Aktif</p>
                <p className="text-2xl font-bold text-blue-600">{bidangData.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Hasil Pencarian</p>
                <p className="text-2xl font-bold text-purple-600">{filteredData.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Bidang Kegiatan</CardTitle>
            <CardDescription>8 Bidang sesuai Standar Nasional Pendidikan</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
              {filteredData.map((bidang) => (
                <Card key={bidang.kode_bidang} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="font-mono text-sm font-bold">{bidang.kode_bidang}</div>
                        <div className="font-medium">{bidang.nama_bidang}</div>
                        <Badge variant="default">Aktif</Badge>
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
                              setSelectedItem(bidang)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(bidang)
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
                    <TableHead className="w-[100px]">Kode</TableHead>
                    <TableHead>Nama Bidang</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((bidang) => (
                    <TableRow key={bidang.kode_bidang}>
                      <TableCell className="font-mono font-bold">{bidang.kode_bidang}</TableCell>
                      <TableCell className="font-medium">{bidang.nama_bidang}</TableCell>
                      <TableCell>
                        <Badge variant="default">Aktif</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(bidang)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(bidang)
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
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Tidak ada data bidang</h3>
                <p className="text-sm">Tambahkan bidang baru atau ubah kata kunci pencarian</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AddBidangDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={loadBidangData} />

        <EditBidangDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          item={selectedItem}
          onSuccess={loadBidangData}
        />

        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => selectedItem && handleDelete(selectedItem.kode_bidang)}
          title="Hapus Data Bidang"
          description={`Apakah Anda yakin ingin menghapus bidang "${selectedItem?.nama_bidang}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </DashboardLayout>
  )
}
