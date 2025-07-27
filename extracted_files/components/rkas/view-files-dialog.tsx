"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Calendar, DollarSign, Building, Target } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ViewFilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
}

export function ViewFilesDialog({ open, onOpenChange, item }: ViewFilesDialogProps) {
  if (!item) return null

  const calculateTotal = () => {
    return (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { color: "bg-orange-100 text-orange-800", label: "Draft" },
      submitted: { color: "bg-blue-100 text-blue-800", label: "Diajukan" },
      approved: { color: "bg-green-100 text-green-800", label: "Disetujui" },
      rejected: { color: "bg-red-100 text-red-800", label: "Ditolak" },
    }

    const statusConfig = variants[status as keyof typeof variants] || variants.draft

    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Eye className="w-5 h-5 mr-2 text-blue-600" />
            Detail Kegiatan RKAS
          </DialogTitle>
          <DialogDescription>Informasi lengkap dan file terkait kegiatan: {item.nama_giat}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Informasi Dasar
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Kode Kegiatan</label>
                    <p className="text-lg font-mono bg-gray-50 p-2 rounded">{item.kode_giat}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama Kegiatan</label>
                    <p className="text-lg font-medium">{item.nama_giat}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{item.subtitle || "Tidak ada deskripsi"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-blue-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bidang</label>
                      <p className="font-medium">
                        {item.kode_bidang} - {item.rkas_bidang?.nama_bidang}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Standar</label>
                      <p className="font-medium">
                        {item.kode_standar} - {item.rkas_standar?.nama_standar}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sumber Dana</label>
                      <p className="font-medium">
                        {item.kode_dana} - {item.rkas_dana?.nama_dana}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tahun & Status</label>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.tahun}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Breakdown */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Rincian Anggaran
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { key: "tw1", label: "Triwulan 1", value: item.tw1 || 0 },
                  { key: "tw2", label: "Triwulan 2", value: item.tw2 || 0 },
                  { key: "tw3", label: "Triwulan 3", value: item.tw3 || 0 },
                  { key: "tw4", label: "Triwulan 4", value: item.tw4 || 0 },
                ].map(({ key, label, value }) => (
                  <div key={key} className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-blue-800">{label}</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(value)}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-semibold">Total Anggaran Kegiatan</span>
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                File Terkait
              </h3>

              <div className="space-y-3">
                {/* Sample files - in real implementation, these would come from database */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Proposal Kegiatan.pdf</p>
                      <p className="text-sm text-gray-500">Uploaded 2 hari yang lalu • 2.5 MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Unduh
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">RAB Detail.xlsx</p>
                      <p className="text-sm text-gray-500">Uploaded 1 hari yang lalu • 1.8 MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Unduh
                    </Button>
                  </div>
                </div>

                <div className="text-center py-4 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Belum ada file tambahan</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Upload File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
