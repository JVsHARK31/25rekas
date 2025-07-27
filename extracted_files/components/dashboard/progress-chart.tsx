"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Calendar, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function ProgressChart() {
  const [progressData, setProgressData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      const { data } = await supabase
        .from("rkas_activities")
        .select("status, tw1, tw2, tw3, tw4, rkas_bidang(nama_bidang)")

      if (data) {
        // Group by bidang and calculate progress
        const grouped = data.reduce((acc, item) => {
          const bidang = item.rkas_bidang?.nama_bidang || "Tidak Diketahui"
          if (!acc[bidang]) {
            acc[bidang] = {
              bidang,
              total: 0,
              approved: 0,
              budget: 0,
              realization: 0,
            }
          }

          acc[bidang].total += 1
          if (item.status === "approved") {
            acc[bidang].approved += 1
          }

          const totalBudget = (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0)
          acc[bidang].budget += totalBudget
          acc[bidang].realization += totalBudget * 0.65 // Mock 65% realization

          return acc
        }, {})

        const progressArray = Object.values(grouped).map((item: any) => ({
          ...item,
          approvalRate: item.total > 0 ? (item.approved / item.total) * 100 : 0,
          realizationRate: item.budget > 0 ? (item.realization / item.budget) * 100 : 0,
        }))

        setProgressData(progressArray)
      }
    } catch (error) {
      console.error("Error loading progress data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-100 text-green-800">Baik</Badge>
    if (percentage >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Sedang</Badge>
    return <Badge className="bg-red-100 text-red-800">Perlu Perhatian</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Progress Kegiatan per Bidang
        </CardTitle>
        <CardDescription>Tingkat persetujuan dan realisasi anggaran</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {progressData.map((item: any, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">{item.bidang}</h4>
                {getProgressBadge(item.approvalRate)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                    Persetujuan
                  </span>
                  <span className={`font-medium ${getProgressColor(item.approvalRate)}`}>
                    {item.approvalRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={item.approvalRate} className="h-2" />
                <p className="text-xs text-gray-500">
                  {item.approved} dari {item.total} kegiatan disetujui
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1 text-blue-600" />
                    Realisasi Anggaran
                  </span>
                  <span className={`font-medium ${getProgressColor(item.realizationRate)}`}>
                    {item.realizationRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={item.realizationRate} className="h-2" />
                <p className="text-xs text-gray-500">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(item.realization)}{" "}
                  dari{" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(item.budget)}
                </p>
              </div>
            </div>
          ))}

          {progressData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada data progress</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
