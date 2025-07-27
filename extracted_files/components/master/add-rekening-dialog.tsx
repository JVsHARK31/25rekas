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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus } from "lucide-react"

interface AddRekeningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddRekeningDialog({ open, onOpenChange, onSuccess }: AddRekeningDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_rekening: "",
    nama_rekening: "",
    kategori: "",
  })
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setFormData({
      kode_rekening: "",
      nama_rekening: "",
      kategori: "",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.kode_rekening.trim()) newErrors.kode_rekening = "Kode rekening harus diisi"
    if (!formData.nama_rekening.trim()) newErrors.nama_rekening = "Nama rekening harus diisi"
    if (!formData.kategori) newErrors.kategori = "Kategori harus dipilih"

    // Validate kode format (should be like 5.1.02.01.01.0012)
    if (formData.kode_rekening && !/^\d+\.\d+\.\d+\.\d+\.\d+\.\d+$/.test(formData.kode_rekening)) {
      newErrors.kode_rekening = "Format kode: X.X.XX.XX.XX.XXXX (contoh: 5.1.02.01.01.0012)"
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
      const { error } = await supabase.from("rkas_rekening").insert([formData])

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "Kode rekening sudah ada, gunakan kode yang berbeda",
            variant: "destructive",
          })
        } else {
          throw error
        }
        return
      }

      toast({
        title: "Berhasil",
        description: "Data rekening berhasil ditambahkan",
      })

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding rekening:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan data rekening",
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
            <Plus className="w-5 h-5 mr-2 text-purple-600" />
            Tambah Rekening Baru
          </DialogTitle>
          <DialogDescription>Tambahkan kode rekening anggaran baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_rekening">
              Kode Rekening <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kode_rekening"
              value={formData.kode_rekening}
              onChange={(e) => handleInputChange("kode_rekening", e.target.value)}
              placeholder="Contoh: 5.1.02.01.01.0012"
              className={errors.kode_rekening ? "border-red-500" : ""}
            />
            {errors.kode_rekening && <p className="text-xs text-red-500">{errors.kode_rekening}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama_rekening">
              Nama Rekening <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_rekening"
              value={formData.nama_rekening}
              onChange={(e) => handleInputChange("nama_rekening", e.target.value)}
              placeholder="Masukkan nama rekening"
              className={errors.nama_rekening ? "border-red-500" : ""}
            />
            {errors.nama_rekening && <p className="text-xs text-red-500">{errors.nama_rekening}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori">
              Kategori <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.kategori} onValueChange={(value) => handleInputChange("kategori", value)}>
              <SelectTrigger className={errors.kategori ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Belanja Barang">Belanja Barang</SelectItem>
                <SelectItem value="Belanja Modal">Belanja Modal</SelectItem>
                <SelectItem value="Belanja Jasa">Belanja Jasa</SelectItem>
                <SelectItem value="Belanja Pegawai">Belanja Pegawai</SelectItem>
                <SelectItem value="Belanja Operasional">Belanja Operasional</SelectItem>
              </SelectContent>
            </Select>
            {errors.kategori && <p className="text-xs text-red-500">{errors.kategori}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
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
