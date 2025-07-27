"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RKASTable } from "@/components/rkas/rkas-table"
import { RKASFilters } from "@/components/rkas/rkas-filters"
import { RKASActions } from "@/components/rkas/rkas-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddRKASDialog } from "@/components/rkas/add-rkas-dialog"

export default function RKASPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [rkasData, setRkasData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const router = useRouter()

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
      await loadRKASData()
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const loadRKASData = async () => {
    const { data, error } = await supabase
      .from("rkas_activities")
      .select(`
        *,
        rkas_bidang(nama_bidang),
        rkas_standar(nama_standar),
        rkas_dana(nama_dana)
      `)
      .order("created_at", { ascending: false })

    if (data) {
      setRkasData(data)
      setFilteredData(data)
    }
  }

  // Use useCallback to prevent infinite re-renders
  const handleFilter = useCallback(
    (filters) => {
      let filtered = [...rkasData]

      if (filters.bidang && filters.bidang !== "all") {
        filtered = filtered.filter((item) => item.kode_bidang === filters.bidang)
      }

      if (filters.year && filters.year !== "all") {
        filtered = filtered.filter((item) => item.tahun === Number.parseInt(filters.year))
      }

      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((item) => item.status === filters.status)
      }

      if (filters.search) {
        filtered = filtered.filter(
          (item) =>
            item.nama_giat.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      setFilteredData(filtered)
    },
    [rkasData],
  )

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data RKAS</h1>
            <p className="text-gray-600">Kelola data Rencana Kegiatan dan Anggaran Sekolah</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kegiatan
          </Button>
        </div>

        <RKASFilters onFilter={handleFilter} />
        <RKASActions data={filteredData} />
        <RKASTable data={filteredData} onDataChange={loadRKASData} />

        <AddRKASDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={loadRKASData} />
      </div>
    </DashboardLayout>
  )
}
