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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Calendar, TrendingUp } from "lucide-react"

interface AddRKASDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddRKASDialog({ open, onOpenChange, onSuccess }: AddRKASDialogProps) {
  const [loading, setLoading] = useState(false)
  const [bidangOptions, setBidangOptions] = useState([])
  const [standarOptions, setStandarOptions] = useState([])
  const [danaOptions, setDanaOptions] = useState([])

  const [formData, setFormData] = useState({
    kode_bidang: "",
    kode_standar: "",
    kode_giat: "",
    nama_giat: "",
    subtitle: "",
    kode_dana: "",
    tw1: 0,
    tw2: 0,
    tw3: 0,
    tw4: 0,
    januari: 0,
    februari: 0,
    maret: 0,
    april: 0,
    mei: 0,
    juni: 0,
    juli: 0,
    agustus: 0,
    september: 0,
    oktober: 0,
    november: 0,
    desember: 0,
    tahun: 2025,
    status: "draft",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      loadOptions()
      resetForm()
    }
  }, [open])

  const loadOptions = async () => {
    try {
      // Load bidang options
      const { data: bidangData } = await supabase.from("rkas_bidang").select("*").order("kode_bidang")
      if (bidangData) setBidangOptions(bidangData)

      // Load standar options
      const { data: standarData } = await supabase.from("rkas_standar").select("*").order("kode_standar")
      if (standarData) setStandarOptions(standarData)

      // Load dana options
      const { data: danaData } = await supabase.from("rkas_dana").select("*").order("kode_dana")
      if (danaData) setDanaOptions(danaData)
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
      kode_bidang: "",
      kode_standar: "",
      kode_giat: "",
      nama_giat: "",
      subtitle: "",
      kode_dana: "",
      tw1: 0,
      tw2: 0,
      tw3: 0,
      tw4: 0,
      januari: 0,
      februari: 0,
      maret: 0,
      april: 0,
      mei: 0,
      juni: 0,
      juli: 0,
      agustus: 0,
      september: 0,
      oktober: 0,
      november: 0,
      desember: 0,
      tahun: 2025,
      status: "draft",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.kode_bidang) newErrors.kode_bidang = "Bidang harus dipilih"
    if (!formData.kode_standar) newErrors.kode_standar = "Standar harus dipilih"
    if (!formData.kode_giat.trim()) newErrors.kode_giat = "Kode kegiatan harus diisi"
    if (!formData.nama_giat.trim()) newErrors.nama_giat = "Nama kegiatan harus diisi"
    if (!formData.kode_dana) newErrors.kode_dana = "Sumber dana harus dipilih"

    // Validate budget values
    const quarterlyTotal = formData.tw1 + formData.tw2 + formData.tw3 + formData.tw4
    const monthlyTotal =
      formData.januari +
      formData.februari +
      formData.maret +
      formData.april +
      formData.mei +
      formData.juni +
      formData.juli +
      formData.agustus +
      formData.september +
      formData.oktober +
      formData.november +
      formData.desember

    if (quarterlyTotal <= 0 && monthlyTotal <= 0) {
      newErrors.budget = "Total anggaran harus lebih dari 0"
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
      const { data: userData } = await supabase.auth.getUser()

      const { error } = await supabase.from("rkas_activities").insert([
        {
          ...formData,
          created_by: userData.user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      toast({
        title: "Berhasil",
        description: "Kegiatan RKAS berhasil ditambahkan",
      })

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding RKAS:", error)
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan kegiatan RKAS",
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

  const calculateQuarterlyTotal = () => {
    return formData.tw1 + formData.tw2 + formData.tw3 + formData.tw4
  }

  const calculateMonthlyTotal = () => {
    return (
      formData.januari +
      formData.februari +
      formData.maret +
      formData.april +
      formData.mei +
      formData.juni +
      formData.juli +
      formData.agustus +
      formData.september +
      formData.oktober +
      formData.november +
      formData.desember
    )
  }

  const calculateGrandTotal = () => {
    return calculateQuarterlyTotal() + calculateMonthlyTotal()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const months = [
    { key: "januari", label: "Januari" },
    { key: "februari", label: "Februari" },
    { key: "maret", label: "Maret" },
    { key: "april", label: "April" },
    { key: "mei", label: "Mei" },
    { key: "juni", label: "Juni" },
    { key: "juli", label: "Juli" },
    { key: "agustus", label: "Agustus" },
    { key: "september", label: "September" },
    { key: "oktober", label: "Oktober" },
    { key: "november", label: "November" },
    { key: "desember", label: "Desember" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Plus className="w-5 h-5 mr-2 text-green-600" />
            Tambah Kegiatan RKAS Baru - Tahun Anggaran 2025
          </DialogTitle>
          <DialogDescription>
            Lengkapi form di bawah untuk menambahkan kegiatan RKAS baru ke dalam sistem
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bidang dan Standar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kode_bidang" className="text-sm font-medium">
                Bidang Kegiatan <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.kode_bidang} onValueChange={(value) => handleInputChange("kode_bidang", value)}>
                <SelectTrigger className={errors.kode_bidang ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih Bidang Kegiatan" />
                </SelectTrigger>
                <SelectContent>
                  {bidangOptions.map((bidang: any) => (
                    <SelectItem key={bidang.kode_bidang} value={bidang.kode_bidang}>
                      {bidang.kode_bidang} - {bidang.nama_bidang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kode_bidang && <p className="text-xs text-red-500">{errors.kode_bidang}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kode_standar" className="text-sm font-medium">
                Standar Nasional <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.kode_standar} onValueChange={(value) => handleInputChange("kode_standar", value)}>
                <SelectTrigger className={errors.kode_standar ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih Standar Nasional" />
                </SelectTrigger>
                <SelectContent>
                  {standarOptions.map((standar: any) => (
                    <SelectItem key={standar.kode_standar} value={standar.kode_standar}>
                      {standar.kode_standar} - {standar.nama_standar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kode_standar && <p className="text-xs text-red-500">{errors.kode_standar}</p>}
            </div>
          </div>

          {/* Kode dan Nama Kegiatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kode_giat" className="text-sm font-medium">
                Kode Kegiatan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kode_giat"
                value={formData.kode_giat}
                onChange={(e) => handleInputChange("kode_giat", e.target.value)}
                placeholder="Contoh: 01.3.02.01.2.001"
                className={errors.kode_giat ? "border-red-500" : ""}
              />
              {errors.kode_giat && <p className="text-xs text-red-500">{errors.kode_giat}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tahun" className="text-sm font-medium">
                Tahun Anggaran
              </Label>
              <Select
                value={formData.tahun.toString()}
                onValueChange={(value) => handleInputChange("tahun", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => 2023 + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nama Kegiatan */}
          <div className="space-y-2">
            <Label htmlFor="nama_giat" className="text-sm font-medium">
              Nama Kegiatan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_giat"
              value={formData.nama_giat}
              onChange={(e) => handleInputChange("nama_giat", e.target.value)}
              placeholder="Masukkan nama kegiatan lengkap"
              className={errors.nama_giat ? "border-red-500" : ""}
            />
            {errors.nama_giat && <p className="text-xs text-red-500">{errors.nama_giat}</p>}
          </div>

          {/* Subtitle/Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-sm font-medium">
              Deskripsi Kegiatan
            </Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              placeholder="Masukkan deskripsi detail kegiatan"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Sumber Dana */}
          <div className="space-y-2">
            <Label htmlFor="kode_dana" className="text-sm font-medium">
              Sumber Dana <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.kode_dana} onValueChange={(value) => handleInputChange("kode_dana", value)}>
              <SelectTrigger className={errors.kode_dana ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih Sumber Dana" />
              </SelectTrigger>
              <SelectContent>
                {danaOptions.map((dana: any) => (
                  <SelectItem key={dana.kode_dana} value={dana.kode_dana}>
                    {dana.kode_dana} - {dana.nama_dana}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kode_dana && <p className="text-xs text-red-500">{errors.kode_dana}</p>}
          </div>

          {/* Budget Input Tabs */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Rencana Anggaran Kegiatan</Label>
            <Tabs defaultValue="quarterly" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quarterly" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Per Triwulan
                </TabsTrigger>
                <TabsTrigger value="monthly" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Per Bulan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quarterly" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: "tw1", label: "Triwulan 1", desc: "Jan-Mar" },
                    { key: "tw2", label: "Triwulan 2", desc: "Apr-Jun" },
                    { key: "tw3", label: "Triwulan 3", desc: "Jul-Sep" },
                    { key: "tw4", label: "Triwulan 4", desc: "Oct-Des" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-xs font-medium text-gray-600">
                        {label}
                        <span className="block text-xs text-gray-400">{desc}</span>
                      </Label>
                      <Input
                        id={key}
                        type="number"
                        value={formData[key]}
                        onChange={(e) => handleInputChange(key, Number.parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="1000"
                        className={errors[key] ? "border-red-500" : ""}
                      />
                      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <Label className="text-blue-800 font-medium">Total Anggaran Triwulan</Label>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(calculateQuarterlyTotal())}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="monthly" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {months.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-xs font-medium text-gray-600">
                        {label}
                      </Label>
                      <Input
                        id={key}
                        type="number"
                        value={formData[key]}
                        onChange={(e) => handleInputChange(key, Number.parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="1000"
                        className={errors[key] ? "border-red-500" : ""}
                      />
                      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
                    </div>
                  ))}
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center">
                    <Label className="text-purple-800 font-medium">Total Anggaran Bulanan</Label>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(calculateMonthlyTotal())}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
          </div>

          {/* Grand Total */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <Label className="text-green-800 font-medium">Total Keseluruhan Anggaran Kegiatan</Label>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateGrandTotal())}</p>
                <p className="text-xs text-green-700">
                  Triwulan: {formatCurrency(calculateQuarterlyTotal())} + Bulanan:{" "}
                  {formatCurrency(calculateMonthlyTotal())}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status Kegiatan
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Diajukan</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
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
                  Simpan Kegiatan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
