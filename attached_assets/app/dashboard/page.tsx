"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { BudgetChart } from "@/components/dashboard/budget-chart"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { ProgressChart } from "@/components/dashboard/progress-chart"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
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

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      setProfile(profile)
      setLoading(false)
    }

    checkAuth()
  }, [router])

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard RKAS</h1>
            <p className="text-gray-600 mt-1">Selamat datang di Sistem RKAS SMPN 25 Jakarta</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">Tahun Anggaran 2025</p>
              <p className="text-xs opacity-90">Status: Aktif</p>
            </div>
          </div>
        </div>

        {/* Alert Info */}
        <Alert className="border-green-200 bg-green-50">
          <Info className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Sistem Demo:</strong> Anda sedang menggunakan sistem demo RKAS dengan data simulasi SMPN 25 Jakarta.
            Semua fitur dapat digunakan untuk keperluan evaluasi dan pelatihan.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <StatsCards />

        {/* Budget Overview */}
        <BudgetOverview />

        {/* Charts and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetChart />
          <ProgressChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivities />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
