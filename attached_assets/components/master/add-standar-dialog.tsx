"use client"

import type React from "react"
import { useState } from "react"
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
import { Loader2, Plus } from "lucide-react"

interface AddStandarDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddStandarDialog({ open, onOpenChange, onSuccess }: AddStandarDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_standar: "",
    nama_standar: "",
  })
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setFormData({
      kode_standar: "",
      nama_standar: "",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.kode_standar.trim()) newErrors.kode_standar = "Kode standar harus diisi"
    if (!formData.nama_standar.trim()) newErrors.nama_standar = "Nama standar harus diisi"

    // Validate kode format (should be 1 digit)
    if (formData.kode_standar && !/^\d{1}$/.test(formData.kode_standar)) {
      newErrors.kode_standar = "Kode standar harus 1 digit angka"
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
      const { error } = await supabase.from("rkas_standar").insert([formData])

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "Kode standar sudah ada, gunakan kode yang berbeda",
            variant: "destructive",
          })
        } else {
          throw error
        }
        return
      }

      toast({
        title: "Berhasil",
        description: "Data standar berhasil ditambahkan",
      })

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding standar:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan data standar",
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

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) resetForm()
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Tambah Standar Baru
          </DialogTitle>
          <DialogDescription>Tambahkan standar nasional pendidikan baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_standar">
              Kode Standar <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kode_standar"
              value={formData.kode_standar}
              onChange={(e) => handleInputChange("kode_standar", e.target.value)}
              placeholder="Contoh: 9"
              maxLength={1}
              className={errors.kode_standar ? "border-red-500" : ""}
            />
            {errors.kode_standar && <p className="text-xs text-red-500">{errors.kode_standar}</p>}
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
                  <Plus className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
