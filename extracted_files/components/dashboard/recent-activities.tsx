"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export function RecentActivities() {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    loadRecentActivities()
  }, [])

  const loadRecentActivities = async () => {
    const { data } = await supabase
      .from("rkas_activities")
      .select(`
        *,
        rkas_bidang(nama_bidang)
      `)
      .order("updated_at", { ascending: false })
      .limit(5)

    if (data) {
      setActivities(data)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      submitted: "default",
      approved: "default",
      rejected: "destructive",
    }

    const labels = {
      draft: "Draft",
      submitted: "Diajukan",
      approved: "Disetujui",
      rejected: "Ditolak",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Kegiatan RKAS yang baru diperbarui</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity: any) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{activity.nama_giat}</p>
                <p className="text-xs text-gray-500">
                  {activity.rkas_bidang?.nama_bidang} •{" "}
                  {formatDistanceToNow(new Date(activity.updated_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-2">{getStatusBadge(activity.status)}</div>
            </div>
          ))}

          {activities.length === 0 && <div className="text-center py-8 text-gray-500">Belum ada aktivitas terbaru</div>}
        </div>
      </CardContent>
    </Card>
  )
}
