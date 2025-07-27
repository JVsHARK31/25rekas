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
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Edit } from "lucide-react"

interface EditBidangDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onSuccess: () => void
}

export function EditBidangDialog({ open, onOpenChange, item, onSuccess }: EditBidangDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_bidang: "",
    nama_bidang: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item && open) {
      setFormData({
        kode_bidang: item.kode_bidang || "",
        nama_bidang: item.nama_bidang || "",
      })
      setErrors({})
    }
  }, [item, open])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nama_bidang.trim()) newErrors.nama_bidang = "Nama bidang harus diisi"

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
      const { error } = await supabase
        .from("rkas_bidang")
        .update({ nama_bidang: formData.nama_bidang })
        .eq("kode_bidang", item.kode_bidang)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Data bidang berhasil diperbarui",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating bidang:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui data bidang",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2 text-blue-600" />
            Edit Bidang
          </DialogTitle>
          <DialogDescription>Perbarui informasi bidang kegiatan</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_bidang">Kode Bidang</Label>
            <Input id="kode_bidang" value={formData.kode_bidang} disabled className="bg-gray-100" />
            <p className="text-xs text-gray-500">Kode bidang tidak dapat diubah</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama_bidang">
              Nama Bidang <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_bidang"
              value={formData.nama_bidang}
              onChange={(e) => handleInputChange("nama_bidang", e.target.value)}
              placeholder="Masukkan nama bidang"
              className={errors.nama_bidang ? "border-red-500" : ""}
            />
            {errors.nama_bidang && <p className="text-xs text-red-500">{errors.nama_bidang}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Perbarui
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
