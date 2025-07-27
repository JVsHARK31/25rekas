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

interface EditStandarDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onSuccess: () => void
}

export function EditStandarDialog({ open, onOpenChange, item, onSuccess }: EditStandarDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_standar: "",
    nama_standar: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item && open) {
      setFormData({
        kode_standar: item.kode_standar || "",
        nama_standar: item.nama_standar || "",
      })
      setErrors({})
    }
  }, [item, open])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nama_standar.trim()) newErrors.nama_standar = "Nama standar harus diisi"

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
        .from("rkas_standar")
        .update({ nama_standar: formData.nama_standar })
        .eq("kode_standar", item.kode_standar)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Data standar berhasil diperbarui",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating standar:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui data standar",
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
            Edit Standar
          </DialogTitle>
          <DialogDescription>Perbarui informasi standar nasional pendidikan</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_standar">Kode Standar</Label>
            <Input id="kode_standar" value={formData.kode_standar} disabled className="bg-gray-100" />
            <p className="text-xs text-gray-500">Kode standar tidak dapat diubah</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama_standar">
              Nama Standar <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_standar"
              value={formData.nama_standar}
              onChange={(e) => handleInputChange("nama_standar", e.target.value)}
              placeholder="Masukkan nama standar"
              className={errors.nama_standar ? "border-red-500" : ""}
            />
            {errors.nama_standar && <p className="text-xs text-red-500">{errors.nama_standar}</p>}
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
