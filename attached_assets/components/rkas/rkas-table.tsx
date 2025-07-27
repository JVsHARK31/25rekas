"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"
import { EditRKASDialog } from "./edit-rkas-dialog"
import { ViewFilesDialog } from "./view-files-dialog"
import { toast } from "@/components/ui/use-toast"

interface RKASTableProps {
  data: any[]
  onDataChange: () => void
}

export function RKASTable({ data, onDataChange }: RKASTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showFilesDialog, setShowFilesDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleEdit = (id: string, field: string, currentValue: any) => {
    setEditingId(id)
    setEditingField(field)
    setEditValue(currentValue?.toString() || "")
  }

  const handleSave = async () => {
    if (!editingId || !editingField) return

    setSaving(true)

    try {
      const updateData: any = {}

      if (["tw1", "tw2", "tw3", "tw4"].includes(editingField)) {
        updateData[editingField] = Number.parseFloat(editValue) || 0
      } else {
        updateData[editingField] = editValue
      }

      const { error } = await supabase.from("rkas_activities").update(updateData).eq("id", editingId)

      if (!error) {
        onDataChange()
        toast({
          title: "Berhasil",
          description: "Data berhasil diperbarui",
        })
      } else {
        console.error("Error updating:", error)
        toast({
          title: "Error",
          description: "Gagal memperbarui data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      setEditingId(null)
      setEditingField(null)
      setEditValue("")
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingField(null)
    setEditValue("")
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const { error } = await supabase.from("rkas_activities").delete().eq("id", id)

        if (!error) {
          onDataChange()
          toast({
            title: "Berhasil",
            description: "Data berhasil dihapus",
          })
        } else {
          console.error("Error deleting:", error)
          toast({
            title: "Error",
            description: "Gagal menghapus data",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting:", error)
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: "secondary", color: "bg-orange-100 text-orange-800", label: "Draft" },
      submitted: { variant: "default", color: "bg-blue-100 text-blue-800", label: "Diajukan" },
      approved: { variant: "default", color: "bg-green-100 text-green-800", label: "Disetujui" },
      rejected: { variant: "destructive", color: "bg-red-100 text-red-800", label: "Ditolak" },
    }

    const statusConfig = variants[status as keyof typeof variants] || variants.draft

    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
  }

  const calculateTotal = (item: any) => {
    return (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0)
  }

  const renderEditableCell = (item: any, field: string, value: any) => {
    const isEditing = editingId === item.id && editingField === field

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8"
            type={["tw1", "tw2", "tw3", "tw4"].includes(field) ? "number" : "text"}
            disabled={saving}
          />
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "..." : "✓"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={saving}>
            ✕
          </Button>
        </div>
      )
    }

    return (
      <div
        className="cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[24px]"
        onClick={() => handleEdit(item.id, field, value)}
        title="Klik untuk edit"
      >
        {["tw1", "tw2", "tw3", "tw4"].includes(field) ? formatCurrency(value || 0) : value || "-"}
      </div>
    )
  }

  // Mobile Card View
  const MobileCard = ({ item }: { item: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 line-clamp-2">{item.nama_giat}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.kode_giat}</p>
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
                    setSelectedItem(item)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedItem(item)
                    setShowFilesDialog(true)
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Lihat File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Bidang:</span>
              <p className="font-medium">{item.kode_bidang}</p>
              <p className="text-xs text-gray-600">{item.rkas_bidang?.nama_bidang}</p>
            </div>
            <div>
              <span className="text-gray-500">Standar:</span>
              <p className="font-medium">{item.kode_standar}</p>
            </div>
            <div>
              <span className="text-gray-500">Dana:</span>
              <p className="font-medium">{item.kode_dana}</p>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <div className="mt-1">{getStatusBadge(item.status)}</div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Total Anggaran</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(calculateTotal(item))}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <p className="text-gray-500">TW1</p>
                <p className="font-medium">{formatCurrency(item.tw1 || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">TW2</p>
                <p className="font-medium">{formatCurrency(item.tw2 || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">TW3</p>
                <p className="font-medium">{formatCurrency(item.tw3 || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">TW4</p>
                <p className="font-medium">{formatCurrency(item.tw4 || 0)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.subtitle && (
            <div>
              <span className="text-sm text-gray-500">Deskripsi:</span>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">{item.subtitle}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="block lg:hidden">
        {data.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Tidak ada data RKAS</p>
              <p className="text-sm text-gray-400">Gunakan tombol "Tambah Kegiatan" untuk menambah data baru</p>
            </CardContent>
          </Card>
        ) : (
          data.map((item) => <MobileCard key={item.id} item={item} />)
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Kode Bidang</TableHead>
                <TableHead className="w-[150px]">Nama Bidang</TableHead>
                <TableHead className="w-[100px]">Kode Standar</TableHead>
                <TableHead className="w-[200px]">Nama Kegiatan</TableHead>
                <TableHead className="w-[200px]">Subtitle</TableHead>
                <TableHead className="w-[100px]">Kode Dana</TableHead>
                <TableHead className="w-[120px]">TW 1</TableHead>
                <TableHead className="w-[120px]">TW 2</TableHead>
                <TableHead className="w-[120px]">TW 3</TableHead>
                <TableHead className="w-[120px]">TW 4</TableHead>
                <TableHead className="w-[120px]">Total</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.kode_bidang}</TableCell>
                  <TableCell>{item.rkas_bidang?.nama_bidang}</TableCell>
                  <TableCell>{item.kode_standar}</TableCell>
                  <TableCell>{renderEditableCell(item, "nama_giat", item.nama_giat)}</TableCell>
                  <TableCell>{renderEditableCell(item, "subtitle", item.subtitle)}</TableCell>
                  <TableCell>{item.kode_dana}</TableCell>
                  <TableCell>{renderEditableCell(item, "tw1", item.tw1)}</TableCell>
                  <TableCell>{renderEditableCell(item, "tw2", item.tw2)}</TableCell>
                  <TableCell>{renderEditableCell(item, "tw3", item.tw3)}</TableCell>
                  <TableCell>{renderEditableCell(item, "tw4", item.tw4)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(calculateTotal(item))}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(item)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(item)
                            setShowFilesDialog(true)
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Lihat File
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Tidak ada data RKAS</p>
            <p className="text-sm">Gunakan tombol "Tambah Kegiatan" untuk menambah data baru</p>
          </div>
        )}
      </div>

      <EditRKASDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        item={selectedItem}
        onSuccess={onDataChange}
      />

      <ViewFilesDialog open={showFilesDialog} onOpenChange={setShowFilesDialog} item={selectedItem} />
    </div>
  )
}
