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

interface AddBidangDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddBidangDialog({ open, onOpenChange, onSuccess }: AddBidangDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_bidang: "",
    nama_bidang: "",
  })
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setFormData({
      kode_bidang: "",
      nama_bidang: "",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.kode_bidang.trim()) newErrors.kode_bidang = "Kode bidang harus diisi"
    if (!formData.nama_bidang.trim()) newErrors.nama_bidang = "Nama bidang harus diisi"

    // Validate kode format (should be 2 digits)
    if (formData.kode_bidang && !/^\d{2}$/.test(formData.kode_bidang)) {
      newErrors.kode_bidang = "Kode bidang harus 2 digit angka"
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
      const { error } = await supabase.from("rkas_bidang").insert([formData])

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "Kode bidang sudah ada, gunakan kode yang berbeda",
            variant: "destructive",
          })
        } else {
          throw error
        }
        return
      }

      toast({
        title: "Berhasil",
        description: "Data bidang berhasil ditambahkan",
      })

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding bidang:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan data bidang",
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
            <Plus className="w-5 h-5 mr-2 text-green-600" />
            Tambah Bidang Baru
          </DialogTitle>
          <DialogDescription>Tambahkan bidang kegiatan RKAS baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_bidang">
              Kode Bidang <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kode_bidang"
              value={formData.kode_bidang}
              onChange={(e) => handleInputChange("kode_bidang", e.target.value)}
              placeholder="Contoh: 09"
              maxLength={2}
              className={errors.kode_bidang ? "border-red-500" : ""}
            />
            {errors.kode_bidang && <p className="text-xs text-red-500">{errors.kode_bidang}</p>}
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
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
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
