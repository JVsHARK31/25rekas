"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Edit } from "lucide-react"

interface EditRKASDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onSuccess: () => void
}

export function EditRKASDialog({ open, onOpenChange, item, onSuccess }: EditRKASDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nama_giat: "",
    subtitle: "",
    tw1: 0,
    tw2: 0,
    tw3: 0,
    tw4: 0,
    status: "draft",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item && open) {
      setFormData({
        nama_giat: item.nama_giat || "",
        subtitle: item.subtitle || "",
        tw1: item.tw1 || 0,
        tw2: item.tw2 || 0,
        tw3: item.tw3 || 0,
        tw4: item.tw4 || 0,
        status: item.status || "draft",
      })
      setErrors({})
    }
  }, [item, open])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nama_giat.trim()) newErrors.nama_giat = "Nama kegiatan harus diisi"

    // Validate budget values
    if (formData.tw1 < 0) newErrors.tw1 = "Nilai tidak boleh negatif"
    if (formData.tw2 < 0) newErrors.tw2 = "Nilai tidak boleh negatif"
    if (formData.tw3 < 0) newErrors.tw3 = "Nilai tidak boleh negatif"
    if (formData.tw4 < 0) newErrors.tw4 = "Nilai tidak boleh negatif"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Mohon periksa kembali form yang diisi",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("rkas_activities").update(formData).eq("id", item.id)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Kegiatan RKAS berhasil diperbarui",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating RKAS:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui kegiatan RKAS",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const calculateTotal = () => {
    return formData.tw1 + formData.tw2 + formData.tw3 + formData.tw4
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Edit className="w-5 h-5 mr-2 text-blue-600" />
            Edit Kegiatan RKAS
          </DialogTitle>
          <DialogDescription>Edit data kegiatan: {item.nama_giat}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Kegiatan */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Kode Kegiatan:</span>
                <p className="text-blue-700 font-mono">{item.kode_giat}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Bidang:</span>
                <p className="text-blue-700">
                  {item.kode_bidang} - {item.rkas_bidang?.nama_bidang}
                </p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Standar:</span>
                <p className="text-blue-700">
                  {item.kode_standar} - {item.rkas_standar?.nama_standar}
                </p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Sumber Dana:</span>
                <p className="text-blue-700">
                  {item.kode_dana} - {item.rkas_dana?.nama_dana}
                </p>
              </div>
            </div>
          </div>

          {/* Nama Kegiatan */}
          <div className="space-y-2">
            <Label htmlFor="nama_giat" className="text-sm font-medium">
              Nama Kegiatan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_giat"
              value={formData.nama_giat}
              onChange={(e) => handleInputChange("nama_giat", e.target.value)}
              className={errors.nama_giat ? "border-red-500" : ""}
            />
            {errors.nama_giat && <p className="text-xs text-red-500">{errors.nama_giat}</p>}
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-sm font-medium">
              Deskripsi Kegiatan
            </Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Anggaran per Triwulan */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Anggaran per Triwulan</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: "tw1", label: "Triwulan 1" },
                { key: "tw2", label: "Triwulan 2" },
                { key: "tw3", label: "Triwulan 3" },
                { key: "tw4", label: "Triwulan 4" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-xs font-medium text-gray-600">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, Number.parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1000"
                    className={errors[key] ? "border-red-500" : ""}
                  />
                  {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Total Anggaran */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <Label className="text-green-800 font-medium">Total Anggaran Kegiatan</Label>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotal())}</p>
                <p className="text-xs text-green-700">
                  {formData.tw1.toLocaleString("id-ID")} + {formData.tw2.toLocaleString("id-ID")} +{" "}
                  {formData.tw3.toLocaleString("id-ID")} + {formData.tw4.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status Kegiatan
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Diajukan</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
