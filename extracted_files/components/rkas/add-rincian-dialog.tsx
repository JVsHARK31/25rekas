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
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Calculator } from "lucide-react"

interface AddRincianDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  activityId?: string
}

export function AddRincianDialog({ open, onOpenChange, onSuccess, activityId }: AddRincianDialogProps) {
  const [loading, setLoading] = useState(false)
  const [activitiesOptions, setActivitiesOptions] = useState([])
  const [rekeningOptions, setRekeningOptions] = useState([])
  const [komponenOptions, setKomponenOptions] = useState([])

  const [formData, setFormData] = useState({
    rkas_activity_id: activityId || "",
    kode_rekening: "",
    kode_komponen: "",
    uraian: "",
    spesifikasi: "",
    volume: 1,
    satuan: "",
    harga_satuan: 0,
    jumlah: 0,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      loadOptions()
      resetForm()
    }
  }, [open, activityId])

  useEffect(() => {
    // Auto calculate jumlah when volume or harga_satuan changes
    const jumlah = formData.volume * formData.harga_satuan
    setFormData((prev) => ({ ...prev, jumlah }))
  }, [formData.volume, formData.harga_satuan])

  const loadOptions = async () => {
    try {
      // Load activities options
      const { data: activitiesData } = await supabase
        .from("rkas_activities")
        .select("id, nama_giat, kode_giat")
        .order("nama_giat")
      if (activitiesData) setActivitiesOptions(activitiesData)

      // Load rekening options
      const { data: rekeningData } = await supabase.from("rkas_rekening").select("*").order("kode_rekening")
      if (rekeningData) setRekeningOptions(rekeningData)

      // Load komponen options
      const { data: komponenData } = await supabase.from("rkas_komponen").select("*").order("nama_komponen")
      if (komponenData) setKomponenOptions(komponenData)
    } catch (error) {
      console.error("Error loading options:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data pilihan",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      rkas_activity_id: activityId || "",
      kode_rekening: "",
      kode_komponen: "",
      uraian: "",
      spesifikasi: "",
      volume: 1,
      satuan: "",
      harga_satuan: 0,
      jumlah: 0,
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.rkas_activity_id) newErrors.rkas_activity_id = "Kegiatan harus dipilih"
    if (!formData.kode_rekening) newErrors.kode_rekening = "Rekening harus dipilih"
    if (!formData.kode_komponen) newErrors.kode_komponen = "Komponen harus dipilih"
    if (!formData.uraian.trim()) newErrors.uraian = "Uraian harus diisi"
    if (!formData.spesifikasi.trim()) newErrors.spesifikasi = "Spesifikasi harus diisi"
    if (formData.volume <= 0) newErrors.volume = "Volume harus lebih dari 0"
    if (!formData.satuan.trim()) newErrors.satuan = "Satuan harus diisi"
    if (formData.harga_satuan <= 0) newErrors.harga_satuan = "Harga satuan harus lebih dari 0"

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
      const { error } = await supabase.from("rkas_rincian").insert([formData])

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      toast({
        title: "Berhasil",
        description: "Rincian anggaran berhasil ditambahkan",
      })

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding rincian:", error)
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan rincian anggaran",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleKomponenChange = (kodeKomponen: string) => {
    const komponen = komponenOptions.find((k) => k.kode_komponen === kodeKomponen)
    setFormData((prev) => ({
      ...prev,
      kode_komponen: kodeKomponen,
      satuan: komponen?.satuan || "",
    }))
    if (errors.kode_komponen) {
      setErrors((prev) => ({ ...prev, kode_komponen: "" }))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Plus className="w-5 h-5 mr-2 text-green-600" />
            Tambah Rincian Anggaran Baru
          </DialogTitle>
          <DialogDescription>Lengkapi form di bawah untuk menambahkan rincian anggaran kegiatan</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kegiatan */}
          <div className="space-y-2">
            <Label htmlFor="rkas_activity_id" className="text-sm font-medium">
              Kegiatan RKAS <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.rkas_activity_id}
              onValueChange={(value) => handleInputChange("rkas_activity_id", value)}
              disabled={!!activityId}
            >
              <SelectTrigger className={errors.rkas_activity_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih Kegiatan RKAS" />
              </SelectTrigger>
              <SelectContent>
                {activitiesOptions.map((activity: any) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.kode_giat} - {activity.nama_giat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rkas_activity_id && <p className="text-xs text-red-500">{errors.rkas_activity_id}</p>}
          </div>

          {/* Rekening dan Komponen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kode_rekening" className="text-sm font-medium">
                Rekening Anggaran <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.kode_rekening}
                onValueChange={(value) => handleInputChange("kode_rekening", value)}
              >
                <SelectTrigger className={errors.kode_rekening ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih Rekening" />
                </SelectTrigger>
                <SelectContent>
                  {rekeningOptions.map((rekening: any) => (
                    <SelectItem key={rekening.kode_rekening} value={rekening.kode_rekening}>
                      {rekening.kode_rekening} - {rekening.nama_rekening}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kode_rekening && <p className="text-xs text-red-500">{errors.kode_rekening}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kode_komponen" className="text-sm font-medium">
                Komponen Belanja <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.kode_komponen} onValueChange={handleKomponenChange}>
                <SelectTrigger className={errors.kode_komponen ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih Komponen" />
                </SelectTrigger>
                <SelectContent>
                  {komponenOptions.map((komponen: any) => (
                    <SelectItem key={komponen.kode_komponen} value={komponen.kode_komponen}>
                      {komponen.nama_komponen} ({komponen.satuan})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kode_komponen && <p className="text-xs text-red-500">{errors.kode_komponen}</p>}
            </div>
          </div>

          {/* Uraian */}
          <div className="space-y-2">
            <Label htmlFor="uraian" className="text-sm font-medium">
              Uraian <span className="text-red-500">*</span>
            </Label>
            <Input
              id="uraian"
              value={formData.uraian}
              onChange={(e) => handleInputChange("uraian", e.target.value)}
              placeholder="Masukkan uraian kegiatan"
              className={errors.uraian ? "border-red-500" : ""}
            />
            {errors.uraian && <p className="text-xs text-red-500">{errors.uraian}</p>}
          </div>

          {/* Spesifikasi */}
          <div className="space-y-2">
            <Label htmlFor="spesifikasi" className="text-sm font-medium">
              Spesifikasi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="spesifikasi"
              value={formData.spesifikasi}
              onChange={(e) => handleInputChange("spesifikasi", e.target.value)}
              placeholder="Masukkan spesifikasi detail"
              rows={3}
              className={`resize-none ${errors.spesifikasi ? "border-red-500" : ""}`}
            />
            {errors.spesifikasi && <p className="text-xs text-red-500">{errors.spesifikasi}</p>}
          </div>

          {/* Volume, Satuan, Harga */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volume" className="text-sm font-medium">
                Volume <span className="text-red-500">*</span>
              </Label>
              <Input
                id="volume"
                type="number"
                value={formData.volume}
                onChange={(e) => handleInputChange("volume", Number.parseFloat(e.target.value) || 0)}
                min="1"
                step="1"
                className={errors.volume ? "border-red-500" : ""}
              />
              {errors.volume && <p className="text-xs text-red-500">{errors.volume}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="satuan" className="text-sm font-medium">
                Satuan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="satuan"
                value={formData.satuan}
                onChange={(e) => handleInputChange("satuan", e.target.value)}
                placeholder="Satuan"
                className={errors.satuan ? "border-red-500" : ""}
                readOnly={!!formData.kode_komponen}
              />
              {errors.satuan && <p className="text-xs text-red-500">{errors.satuan}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="harga_satuan" className="text-sm font-medium">
                Harga Satuan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="harga_satuan"
                type="number"
                value={formData.harga_satuan}
                onChange={(e) => handleInputChange("harga_satuan", Number.parseFloat(e.target.value) || 0)}
                min="0"
                step="1000"
                className={errors.harga_satuan ? "border-red-500" : ""}
              />
              {errors.harga_satuan && <p className="text-xs text-red-500">{errors.harga_satuan}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlah" className="text-sm font-medium">
                Jumlah
              </Label>
              <Input id="jumlah" type="number" value={formData.jumlah} readOnly className="bg-gray-100" />
            </div>
          </div>

          {/* Total Calculation */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-green-600" />
                <Label className="text-green-800 font-medium">Total Anggaran</Label>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(formData.jumlah)}</p>
                <p className="text-xs text-green-700">
                  {formData.volume} {formData.satuan} × {formatCurrency(formData.harga_satuan)}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Simpan Rincian
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
