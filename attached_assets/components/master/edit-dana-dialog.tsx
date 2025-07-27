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

interface EditDanaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onSuccess: () => void
}

export function EditDanaDialog({ open, onOpenChange, item, onSuccess }: EditDanaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_dana: "",
    nama_dana: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item && open) {
      setFormData({
        kode_dana: item.kode_dana || "",
        nama_dana: item.nama_dana || "",
      })
      setErrors({})
    }
  }, [item, open])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nama_dana.trim()) newErrors.nama_dana = "Nama dana harus diisi"

    // Validate kode format (should be like 3.02.01)
    if (formData.kode_dana && !/^\d+\.\d+\.\d+$/.test(formData.kode_dana)) {
      newErrors.kode_dana = "Format kode dana: X.XX.XX (contoh: 3.02.01)"
    }

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
        .from("rkas_dana")
        .update({ nama_dana: formData.nama_dana })
        .eq("kode_dana", item.kode_dana)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Data sumber dana berhasil diperbarui",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating dana:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui data sumber dana",
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
            Edit Sumber Dana
          </DialogTitle>
          <DialogDescription>Perbarui informasi sumber dana</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_dana">Kode Dana</Label>
            <Input id="kode_dana" value={formData.kode_dana} disabled className="bg-gray-100" />
            <p className="text-xs text-gray-500">Kode dana tidak dapat diubah</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama_dana">
              Nama Sumber Dana <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_dana"
              value={formData.nama_dana}
              onChange={(e) => handleInputChange("nama_dana", e.target.value)}
              placeholder="Masukkan nama sumber dana"
              className={errors.nama_dana ? "border-red-500" : ""}
            />
            {errors.nama_dana && <p className="text-xs text-red-500">{errors.nama_dana}</p>}
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
