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

interface AddKomponenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddKomponenDialog({ open, onOpenChange, onSuccess }: AddKomponenDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_komponen: "",
    nama_komponen: "",
    satuan: "",
    kategori: "",
  })
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setFormData({
      kode_komponen: "",
      nama_komponen: "",
      satuan: "",
      kategori: "",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.kode_komponen.trim()) newErrors.kode_komponen = "Kode komponen harus diisi"
    if (!formData.nama_komponen.trim()) newErrors.nama_komponen = "Nama komponen harus diisi"
    if (!formData.satuan.trim()) newErrors.satuan = "Satuan harus diisi"
    if (!formData.kategori) newErrors.kategori = "Kategori harus dipilih"

    // Validate kode format (should be like 1.1.12.01.03.0009.00032)
    if (formData.kode_komponen && !/^\d+\.\d+\.\d+\.\d+\.\d+\.\d+\.\d+$/.test(formData.kode_komponen)) {
      newErrors.kode_komponen = "Format kode: X.X.XX.XX.XX.XXXX.XXXXX (contoh: 1.1.12.01.03.0009.00032)"
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
      const { error } = await supabase.from("rkas_komponen").insert([formData])

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "Kode komponen sudah ada, gunakan kode yang berbeda",
            variant: "destructive",
          })
        } else {
          throw error
        }
        return
      }

      toast({
        title: "Berhasil",
        description: "Data komponen berhasil ditambahkan",
      })

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding komponen:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan data komponen",
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
            <Plus className="w-5 h-5 mr-2 text-orange-600" />
            Tambah Komponen Baru
          </DialogTitle>
          <DialogDescription>Tambahkan komponen belanja baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_komponen">
              Kode Komponen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kode_komponen"
              value={formData.kode_komponen}
              onChange={(e) => handleInputChange("kode_komponen", e.target.value)}
              placeholder="Contoh: 1.1.12.01.03.0009.00032"
              className={errors.kode_komponen ? "border-red-500" : ""}
            />
            {errors.kode_komponen && <p className="text-xs text-red-500">{errors.kode_komponen}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama_komponen">
              Nama Komponen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_komponen"
              value={formData.nama_komponen}
              onChange={(e) => handleInputChange("nama_komponen", e.target.value)}
              placeholder="Masukkan nama komponen"
              className={errors.nama_komponen ? "border-red-500" : ""}
            />
            {errors.nama_komponen && <p className="text-xs text-red-500">{errors.nama_komponen}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="satuan">
              Satuan <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.satuan} onValueChange={(value) => handleInputChange("satuan", value)}>
              <SelectTrigger className={errors.satuan ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih Satuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buah">Buah</SelectItem>
                <SelectItem value="Unit">Unit</SelectItem>
                <SelectItem value="Set">Set</SelectItem>
                <SelectItem value="Paket">Paket</SelectItem>
                <SelectItem value="Roll">Roll</SelectItem>
                <SelectItem value="Lembar">Lembar</SelectItem>
                <SelectItem value="Buku">Buku</SelectItem>
                <SelectItem value="Rim">Rim</SelectItem>
                <SelectItem value="Dus">Dus</SelectItem>
                <SelectItem value="Kg">Kg</SelectItem>
                <SelectItem value="Liter">Liter</SelectItem>
                <SelectItem value="Meter">Meter</SelectItem>
              </SelectContent>
            </Select>
            {errors.satuan && <p className="text-xs text-red-500">{errors.satuan}</p>}
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
                <SelectItem value="Pakaian">Pakaian</SelectItem>
                <SelectItem value="Bahan">Bahan</SelectItem>
                <SelectItem value="Aksesoris">Aksesoris</SelectItem>
                <SelectItem value="Percetakan">Percetakan</SelectItem>
                <SelectItem value="Olahraga">Olahraga</SelectItem>
                <SelectItem value="Alat Tulis">Alat Tulis</SelectItem>
                <SelectItem value="Elektronik">Elektronik</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Konsumsi">Konsumsi</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.kategori && <p className="text-xs text-red-500">{errors.kategori}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
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
