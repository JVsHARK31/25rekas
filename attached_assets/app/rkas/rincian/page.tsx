"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RincianTable } from "@/components/rkas/rincian-table"
import { AddRincianDialog } from "@/components/rkas/add-rincian-dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Calculator, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export default function RincianPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [rincianData, setRincianData] = useState([])
  const [activityData, setActivityData] = useState(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const activityId = searchParams.get("activity")

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
        return
      }

      setUser(user)

      // Get user profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profile)

      if (activityId) {
        await loadActivityData(activityId)
        await loadRincianData(activityId)
      } else {
        await loadAllRincianData()
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, activityId])

  const loadActivityData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("rkas_activities")
        .select(`
          *,
          rkas_bidang(nama_bidang),
          rkas_standar(nama_standar),
          rkas_dana(nama_dana)
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      setActivityData(data)
    } catch (error) {
      console.error("Error loading activity data:", error)
    }
  }

  const loadRincianData = async (activityId: string) => {
    try {
      const { data, error } = await supabase
        .from("rkas_rincian")
        .select(`
          *,
          rkas_rekening(nama_rekening, kategori),
          rkas_komponen(nama_komponen, satuan, kategori),
          rkas_activity(nama_giat, kode_giat)
        `)
        .eq("rkas_activity_id", activityId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRincianData(data || [])
    } catch (error) {
      console.error("Error loading rincian data:", error)
      setRincianData([])
    }
  }

  const loadAllRincianData = async () => {
    try {
      const { data, error } = await supabase
        .from("rkas_rincian")
        .select(`
          *,
          rkas_rekening(nama_rekening, kategori),
          rkas_komponen(nama_komponen, satuan, kategori),
          rkas_activity(nama_giat, kode_giat)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRincianData(data || [])
    } catch (error) {
      console.error("Error loading rincian data:", error)
      setRincianData([])
    }
  }

  const handleDataChange = () => {
    if (activityId) {
      loadRincianData(activityId)
    } else {
      loadAllRincianData()
    }
  }

  const calculateTotalAnggaran = () => {
    return rincianData.reduce((total, item) => total + (item.jumlah || 0), 0)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { color: "bg-orange-100 text-orange-800", label: "Draft" },
      submitted: { color: "bg-blue-100 text-blue-800", label: "Diajukan" },
      approved: { color: "bg-green-100 text-green-800", label: "Disetujui" },
      rejected: { color: "bg-red-100 text-red-800", label: "Ditolak" },
    }

    const statusConfig = variants[status as keyof typeof variants] || variants.draft

    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Link href="/rkas">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {activityId ? "Rincian Anggaran Kegiatan" : "Semua Rincian Anggaran"}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {activityId
                    ? "Kelola rincian anggaran untuk kegiatan terpilih"
                    : "Kelola semua rincian anggaran RKAS"}
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Rincian
          </Button>
        </div>

        {/* Activity Info (if specific activity) */}
        {activityData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informasi Kegiatan</span>
                {getStatusBadge(activityData.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Kode Kegiatan</p>
                  <p className="font-mono font-bold">{activityData.kode_giat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama Kegiatan</p>
                  <p className="font-medium">{activityData.nama_giat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bidang</p>
                  <p className="font-medium">
                    {activityData.kode_bidang} - {activityData.rkas_bidang?.nama_bidang}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sumber Dana</p>
                  <p className="font-medium">
                    {activityData.kode_dana} - {activityData.rkas_dana?.nama_dana}
                  </p>
                </div>
              </div>
              {activityData.subtitle && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Deskripsi</p>
                  <p className="text-sm">{activityData.subtitle}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Rincian</p>
                <p className="text-2xl font-bold text-purple-600">{rincianData.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Anggaran</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(calculateTotalAnggaran())}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Rata-rata per Item</p>
                <p className="text-lg font-bold text-blue-600">
                  {rincianData.length > 0
                    ? formatCurrency(calculateTotalAnggaran() / rincianData.length)
                    : formatCurrency(0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rincian Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Rincian Anggaran</CardTitle>
            <CardDescription>
              {activityId ? "Rincian anggaran untuk kegiatan terpilih" : "Semua rincian anggaran dalam sistem"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RincianTable data={rincianData} onDataChange={handleDataChange} />
          </CardContent>
        </Card>

        <AddRincianDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleDataChange}
          activityId={activityId}
        />
      </div>
    </DashboardLayout>
  )
}
