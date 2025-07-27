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

interface EditRekeningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onSuccess: () => void
}

export function EditRekeningDialog({ open, onOpenChange, item, onSuccess }: EditRekeningDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kode_rekening: "",
    nama_rekening: "",
    kategori: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item && open) {
      setFormData({
        kode_rekening: item.kode_rekening || "",
        nama_rekening: item.nama_rekening || "",
        kategori: item.kategori || "",
      })
      setErrors({})
    }
  }, [item, open])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nama_rekening.trim()) newErrors.nama_rekening = "Nama rekening harus diisi"
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
        .from("rkas_rekening")
        .update({
          nama_rekening: formData.nama_rekening,
          kategori: formData.kategori,
        })
        .eq("kode_rekening", item.kode_rekening)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Data rekening berhasil diperbarui",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating rekening:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui data rekening",
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
            <Edit className="w-5 h-5 mr-2 text-purple-600" />
            Edit Rekening
          </DialogTitle>
          <DialogDescription>Perbarui informasi rekening anggaran</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode_rekening">Kode Rekening</Label>
            <Input id="kode_rekening" value={formData.kode_rekening} disabled className="bg-gray-100" />
            <p className="text-xs text-gray-500">Kode rekening tidak dapat diubah</p>
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
