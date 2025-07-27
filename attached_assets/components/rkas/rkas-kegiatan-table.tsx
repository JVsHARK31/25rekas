"use client"

import { useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, FileText, Eye, Calculator, BookOpen, Plus, Copy } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"
import { EditRKASDialog } from "./edit-rkas-dialog"
import { ViewFilesDialog } from "./view-files-dialog"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface RKASKegiatanTableProps {
  data: any[]
  onDataChange: () => void
}

export function RKASKegiatanTable({ data, onDataChange }: RKASKegiatanTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showFilesDialog, setShowFilesDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleEdit = useCallback((id: string, field: string, currentValue: any) => {
    setEditingId(id)
    setEditingField(field)
    setEditValue(currentValue?.toString() || "")
  }, [])

  const handleSave = useCallback(async () => {
    if (!editingId || !editingField) return

    setSaving(true)

    try {
      const updateData: any = {}

      if (["tw1", "tw2", "tw3", "tw4"].includes(editingField)) {
        const numValue = Number.parseFloat(editValue) || 0
        if (numValue < 0) {
          toast({
            title: "Error",
            description: "Nilai anggaran tidak boleh negatif",
            variant: "destructive",
          })
          return
        }
        updateData[editingField] = numValue
      } else {
        if (!editValue.trim()) {
          toast({
            title: "Error",
            description: "Field tidak boleh kosong",
            variant: "destructive",
          })
          return
        }
        updateData[editingField] = editValue.trim()
      }

      const { error } = await supabase.from("rkas_activities").update(updateData).eq("id", editingId)

      if (error) throw error

      onDataChange()
      toast({
        title: "Berhasil",
        description: "Data berhasil diperbarui",
      })
    } catch (error) {
      console.error("Error saving:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      setEditingId(null)
      setEditingField(null)
      setEditValue("")
    }
  }, [editingId, editingField, editValue, onDataChange])

  const handleCancel = useCallback(() => {
    setEditingId(null)
    setEditingField(null)
    setEditValue("")
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from("rkas_activities").delete().eq("id", id)

        if (error) throw error

        onDataChange()
        setShowDeleteDialog(false)
        setSelectedItem(null)
        toast({
          title: "Berhasil",
          description: "Kegiatan berhasil dihapus",
        })
      } catch (error) {
        console.error("Error deleting:", error)
        toast({
          title: "Error",
          description: "Gagal menghapus kegiatan",
          variant: "destructive",
        })
      }
    },
    [onDataChange],
  )

  const handleCopy = useCallback((item: any) => {
    const text = `${item.kode_giat} - ${item.nama_giat}`
    navigator.clipboard.writeText(text)
    toast({
      title: "Berhasil",
      description: "Kode dan nama kegiatan disalin ke clipboard",
    })
  }, [])

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: "secondary", label: "Draft", color: "bg-gray-100 text-gray-800" },
      submitted: { variant: "default", label: "Diajukan", color: "bg-yellow-100 text-yellow-800" },
      approved: { variant: "default", label: "Disetujui", color: "bg-green-100 text-green-800" },
      rejected: { variant: "destructive", label: "Ditolak", color: "bg-red-100 text-red-800" },
    }

    const config = variants[status as keyof typeof variants] || variants.draft

    return <Badge className={config.color}>{config.label}</Badge>
  }

  const calculateTotal = (item: any) => {
    return (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0)
  }

  const renderEditableCell = (item: any, field: string, value: any) => {
    const isEditing = editingId === item.id && editingField === field

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2 min-w-[200px]">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-xs"
            type={["tw1", "tw2", "tw3", "tw4"].includes(field) ? "number" : "text"}
            disabled={saving}
            placeholder={field.includes("tw") ? "0" : "Masukkan nilai"}
          />
          <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 px-2">
            {saving ? "..." : "✓"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
            className="h-8 px-2 bg-transparent"
          >
            ✕
          </Button>
        </div>
      )
    }

    return (
      <div
        className="cursor-pointer hover:bg-gray-100 p-2 rounded min-h-[32px] flex items-center transition-colors"
        onClick={() => handleEdit(item.id, field, value)}
        title="Klik untuk edit"
      >
        <span className="text-xs sm:text-sm">
          {["tw1", "tw2", "tw3", "tw4"].includes(field) ? formatCurrency(value || 0) : value || "-"}
        </span>
      </div>
    )
  }

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 p-4 border-t bg-gray-50">
      <div className="text-xs sm:text-sm text-gray-600">
        Menampilkan {startIndex + 1}-{Math.min(endIndex, data.length)} dari {data.length} kegiatan
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-xs"
        >
          Sebelumnya
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0 text-xs"
              >
                {page}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-xs"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        <div className="divide-y">
          {currentData.map((item, index) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-medium text-sm">{item.nama_giat}</div>
                  <div className="text-xs text-gray-500">{item.kode_giat}</div>
                  <div className="text-xs text-gray-600">{item.rkas_bidang?.nama_bidang}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(item.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item)
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Kegiatan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(item)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Salin Kode
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/rkas/rincian?kegiatan=${item.id}`}>
                          <Calculator className="mr-2 h-4 w-4" />
                          Input Rincian
                        </Link>
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item)
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
              </div>

              <div className="text-xs text-gray-600 line-clamp-2">{item.subtitle}</div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">TW1:</span>
                  <span className="ml-1 font-medium">{formatCurrency(item.tw1 || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-500">TW2:</span>
                  <span className="ml-1 font-medium">{formatCurrency(item.tw2 || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-500">TW3:</span>
                  <span className="ml-1 font-medium">{formatCurrency(item.tw3 || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-500">TW4:</span>
                  <span className="ml-1 font-medium">{formatCurrency(item.tw4 || 0)}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Total Anggaran:</span>
                  <span className="font-bold text-green-600 text-sm">{formatCurrency(calculateTotal(item))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[60px] font-semibold text-xs">No</TableHead>
              <TableHead className="w-[80px] font-semibold text-xs">Bidang</TableHead>
              <TableHead className="w-[120px] font-semibold text-xs">Nama Bidang</TableHead>
              <TableHead className="w-[80px] font-semibold text-xs">Standar</TableHead>
              <TableHead className="w-[100px] font-semibold text-xs">ID Giat</TableHead>
              <TableHead className="w-[120px] font-semibold text-xs">Kode Giat</TableHead>
              <TableHead className="w-[200px] font-semibold text-xs">Nama Kegiatan</TableHead>
              <TableHead className="w-[250px] font-semibold text-xs">Subtitle</TableHead>
              <TableHead className="w-[80px] font-semibold text-xs">Dana</TableHead>
              <TableHead className="w-[100px] font-semibold text-xs">TW 1</TableHead>
              <TableHead className="w-[100px] font-semibold text-xs">TW 2</TableHead>
              <TableHead className="w-[100px] font-semibold text-xs">TW 3</TableHead>
              <TableHead className="w-[100px] font-semibold text-xs">TW 4</TableHead>
              <TableHead className="w-[120px] font-semibold text-xs">Total</TableHead>
              <TableHead className="w-[100px] font-semibold text-xs">Status</TableHead>
              <TableHead className="w-[80px] font-semibold text-xs">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-xs">{startIndex + index + 1}</TableCell>
                <TableCell className="text-xs">{item.kode_bidang}</TableCell>
                <TableCell className="font-medium text-xs">{item.rkas_bidang?.nama_bidang}</TableCell>
                <TableCell className="text-xs">{item.kode_standar}</TableCell>
                <TableCell className="font-mono text-xs">{item.id_giat || item.id.slice(-6)}</TableCell>
                <TableCell className="font-mono text-xs">{item.kode_giat}</TableCell>
                <TableCell>{renderEditableCell(item, "nama_giat", item.nama_giat)}</TableCell>
                <TableCell>{renderEditableCell(item, "subtitle", item.subtitle)}</TableCell>
                <TableCell className="text-xs">{item.kode_dana}</TableCell>
                <TableCell>{renderEditableCell(item, "tw1", item.tw1)}</TableCell>
                <TableCell>{renderEditableCell(item, "tw2", item.tw2)}</TableCell>
                <TableCell>{renderEditableCell(item, "tw3", item.tw3)}</TableCell>
                <TableCell>{renderEditableCell(item, "tw4", item.tw4)}</TableCell>
                <TableCell className="font-bold text-green-600 text-xs">
                  {formatCurrency(calculateTotal(item))}
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item)
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Kegiatan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(item)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Salin Kode
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/rkas/rincian?kegiatan=${item.id}`}>
                          <Calculator className="mr-2 h-4 w-4" />
                          Input Rincian
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/rkas/anggaran-kas?kegiatan=${item.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Anggaran Kas
                        </Link>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/rkas/detail?id=${item.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Detail Lengkap
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item)
                          setShowDeleteDialog(true)
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Kegiatan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Belum ada kegiatan RKAS</h3>
          <p className="text-sm mb-4">Mulai dengan menambahkan kegiatan RKAS pertama Anda</p>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kegiatan Baru
          </Button>
        </div>
      )}

      {/* Pagination */}
      {data.length > 0 && <PaginationControls />}

      {/* Dialogs */}
      <EditRKASDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        item={selectedItem}
        onSuccess={onDataChange}
      />

      <ViewFilesDialog open={showFilesDialog} onOpenChange={setShowFilesDialog} item={selectedItem} />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => selectedItem && handleDelete(selectedItem.id)}
        title="Hapus Kegiatan RKAS"
        description={`Apakah Anda yakin ingin menghapus kegiatan "${selectedItem?.nama_giat}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  )
}
