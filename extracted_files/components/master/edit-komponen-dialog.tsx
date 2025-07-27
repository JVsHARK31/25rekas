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
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Edit } from "lucide-react"

interface EditKomponenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onSuccess: () => void
}

export function EditKomponenDialog({ open, onOpenChange, item, onSuccess }: EditKomponenDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_komponen: "",
    nama_komponen: "",
    satuan: "",
    kategori: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item && open) {
      setFormData({
        kode_komponen: item.kode_komponen || "",
        nama_komponen: item.nama_komponen || "",
        satuan: item.satuan || "",
        kategori: item.kategori || "",
      })
      setErrors({})
    }
  }, [item, open])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nama_komponen.trim()) newErrors.nama_komponen = "Nama komponen harus diisi"
    if (!formData.satuan.trim()) newErrors.satuan = "Satuan harus diisi"
    if (!formData.kategori) newErrors.kategori = "Kategori harus dipilih"

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
        .from("rkas_komponen")
        .update({
          nama_komponen: formData.nama_komponen,
          satuan: formData.satuan,
          kategori: formData.kategori,
        })
        .eq("kode_komponen", item.kode_komponen)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Data komponen berhasil diperbarui",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating komponen:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui data komponen",
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
            <Edit className="w-5 h-5 mr-2 text-orange-600" />
            Edit Komponen
          </DialogTitle>
          <DialogDescription>Perbarui informasi komponen belanja</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_komponen">Kode Komponen</Label>
            <Input id="kode_komponen" value={formData.kode_komponen} disabled className="bg-gray-100" />
            <p className="text-xs text-gray-500">Kode komponen tidak dapat diubah</p>
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
