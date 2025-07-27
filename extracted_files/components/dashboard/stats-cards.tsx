"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, DollarSign, CheckCircle, Clock, TrendingUp, AlertTriangle, Target, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalKegiatan: 0,
    totalAnggaran: 0,
    kegiatanDisetujui: 0,
    kegiatanMenunggu: 0,
    realisasiAnggaran: 0,
    persentaseRealisasi: 0,
    kegiatanTerlambat: 0,
    targetCapaian: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { data: allActivities } = await supabase.from("rkas_activities").select("tw1, tw2, tw3, tw4, status")

      if (allActivities) {
        const totalAnggaran = allActivities.reduce((sum, item) => {
          return sum + (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0)
        }, 0)

        const kegiatanDisetujui = allActivities.filter((item) => item.status === "approved").length
        const kegiatanMenunggu = allActivities.filter((item) => ["draft", "submitted"].includes(item.status)).length
        const realisasiAnggaran = totalAnggaran * 0.65 // Mock 65% realization
        const persentaseRealisasi = totalAnggaran > 0 ? (realisasiAnggaran / totalAnggaran) * 100 : 0

        setStats({
          totalKegiatan: allActivities.length,
          totalAnggaran,
          kegiatanDisetujui,
          kegiatanMenunggu,
          realisasiAnggaran,
          persentaseRealisasi,
          kegiatanTerlambat: Math.floor(allActivities.length * 0.1), // Mock 10% late
          targetCapaian: 85, // Mock target
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const statsData = [
    {
      title: "Total Kegiatan",
      value: stats.totalKegiatan.toString(),
      description: "Kegiatan RKAS terdaftar",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Anggaran",
      value: formatCurrency(stats.totalAnggaran),
      description: "Anggaran keseluruhan",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Kegiatan Disetujui",
      value: stats.kegiatanDisetujui.toString(),
      description: "Sudah mendapat persetujuan",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Menunggu Persetujuan",
      value: stats.kegiatanMenunggu.toString(),
      description: "Dalam proses review",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Realisasi Anggaran",
      value: formatCurrency(stats.realisasiAnggaran),
      description: `${stats.persentaseRealisasi.toFixed(1)}% dari total`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Kegiatan Terlambat",
      value: stats.kegiatanTerlambat.toString(),
      description: "Perlu perhatian khusus",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Target Capaian",
      value: `${stats.targetCapaian}%`,
      description: "Target semester ini",
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Aktivitas Hari Ini",
      value: "12",
      description: "Update dan perubahan",
      icon: Activity,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
