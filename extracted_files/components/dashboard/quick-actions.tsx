"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  FileSpreadsheet,
  Calculator,
  BookOpen,
  BarChart3,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const quickActions = [
    {
      title: "Input Kegiatan Baru",
      description: "Tambah kegiatan RKAS baru",
      icon: Plus,
      href: "/rkas/kegiatan",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Input Rincian Anggaran",
      description: "Detail komponen anggaran",
      icon: Calculator,
      href: "/rkas/rincian",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Anggaran Kas Belanja",
      description: "Kelola anggaran kas bulanan",
      icon: BookOpen,
      href: "/rkas/anggaran-kas",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Input Realisasi",
      description: "Catat realisasi kegiatan",
      icon: CheckCircle,
      href: "/rkas/realisasi",
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: "Laporan RKAS",
      description: "Generate laporan lengkap",
      icon: FileText,
      href: "/laporan/rkas",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "Monitoring Progress",
      description: "Pantau kemajuan kegiatan",
      icon: TrendingUp,
      href: "/monitoring/progress",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: "Export Data",
      description: "Download data Excel/PDF",
      icon: FileSpreadsheet,
      href: "/laporan/export",
      color: "bg-teal-600 hover:bg-teal-700",
    },
    {
      title: "Alert & Notifikasi",
      description: "Lihat pemberitahuan penting",
      icon: AlertCircle,
      href: "/monitoring/alerts",
      color: "bg-red-600 hover:bg-red-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Aksi Cepat
        </CardTitle>
        <CardDescription>Akses fitur utama dengan cepat</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href} className="block">
            <Button className={`w-full justify-start h-auto p-3 ${action.color} text-white`} variant="default">
              <div className="flex items-center w-full">
                <action.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
