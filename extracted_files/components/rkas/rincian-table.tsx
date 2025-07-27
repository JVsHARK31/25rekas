"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface RincianTableProps {
  data: any[]
  onDataChange: () => void
}

export function RincianTable({ data, onDataChange }: RincianTableProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus rincian ini?")) {
      setLoading(true)
      try {
        const { error } = await supabase.from("rkas_rincian").delete().eq("id", id)

        if (!error) {
          onDataChange()
          toast({
            title: "Berhasil",
            description: "Rincian berhasil dihapus",
          })
        } else {
          console.error("Error deleting:", error)
          toast({
            title: "Error",
            description: "Gagal menghapus rincian",
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
      } finally {
        setLoading(false)
      }
    }
  }

  // Mobile Card View
  const MobileCard = ({ item }: { item: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 line-clamp-2">{item.uraian}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.spesifikasi}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
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
              <span className="text-gray-500">Rekening:</span>
              <p className="font-medium text-xs">{item.kode_rekening}</p>
              <p className="text-xs text-gray-600">{item.rkas_rekening?.nama_rekening}</p>
            </div>
            <div>
              <span className="text-gray-500">Komponen:</span>
              <p className="font-medium text-xs">{item.rkas_komponen?.nama_komponen}</p>
            </div>
            <div>
              <span className="text-gray-500">Volume:</span>
              <p className="font-medium">
                {item.volume} {item.satuan}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Harga Satuan:</span>
              <p className="font-medium">{formatCurrency(item.harga_satuan)}</p>
            </div>
          </div>

          {/* Total */}
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Total</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(item.jumlah)}</span>
            </div>
          </div>
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
              <p className="text-gray-500">Tidak ada rincian anggaran</p>
              <p className="text-sm text-gray-400">Gunakan tombol "Tambah Rincian" untuk menambah data baru</p>
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
                <TableHead className="w-[150px]">Kode Rekening</TableHead>
                <TableHead className="w-[200px]">Uraian</TableHead>
                <TableHead className="w-[200px]">Spesifikasi</TableHead>
                <TableHead className="w-[100px]">Volume</TableHead>
                <TableHead className="w-[80px]">Satuan</TableHead>
                <TableHead className="w-[120px]">Harga Satuan</TableHead>
                <TableHead className="w-[120px]">Jumlah</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.kode_rekening}</TableCell>
                  <TableCell className="font-medium">{item.uraian}</TableCell>
                  <TableCell className="text-sm text-gray-600">{item.spesifikasi}</TableCell>
                  <TableCell className="text-center">{item.volume}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.harga_satuan)}</TableCell>
                  <TableCell className="font-bold text-green-600">{formatCurrency(item.jumlah)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
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
            <p>Tidak ada rincian anggaran</p>
            <p className="text-sm">Gunakan tombol "Tambah Rincian" untuk menambah data baru</p>
          </div>
        )}
      </div>
    </div>
  )
}
