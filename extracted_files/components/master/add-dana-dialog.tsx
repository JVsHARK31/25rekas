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

interface AddDanaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddDanaDialog({ open, onOpenChange, onSuccess }: AddDanaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_dana: "",
    nama_dana: "",
  })
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setFormData({
      kode_dana: "",
      nama_dana: "",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.kode_dana.trim()) newErrors.kode_dana = "Kode dana harus diisi"
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
      const { error } = await supabase.from("rkas_dana").insert([formData])

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "Kode dana sudah ada, gunakan kode yang berbeda",
            variant: "destructive",
          })
        } else {
          throw error
        }
        return
      }

      toast({
        title: "Berhasil",
        description: "Data sumber dana berhasil ditambahkan",
      })

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding dana:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan data sumber dana",
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
            Tambah Sumber Dana Baru
          </DialogTitle>
          <DialogDescription>Tambahkan sumber dana untuk kegiatan RKAS</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_dana">
              Kode Dana <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kode_dana"
              value={formData.kode_dana}
              onChange={(e) => handleInputChange("kode_dana", e.target.value)}
              placeholder="Contoh: 3.02.01"
              className={errors.kode_dana ? "border-red-500" : ""}
            />
            {errors.kode_dana && <p className="text-xs text-red-500">{errors.kode_dana}</p>}
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
