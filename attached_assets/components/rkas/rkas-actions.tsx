"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, FileText, BarChart3, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { exportToExcel, exportToPDF } from "@/lib/export-utils"
import { formatCurrency } from "@/lib/utils"

interface RKASActionsProps {
  data: any[]
}

export function RKASActions({ data }: RKASActionsProps) {
  const handleExportExcel = () => {
    exportToExcel(data, "RKAS_Data")
  }

  const handleExportPDF = () => {
    exportToPDF(data, "RKAS Data")
  }

  // Calculate statistics
  const totalActivities = data.length
  const totalBudget = data.reduce((sum, item) => sum + (item.tw1 + item.tw2 + item.tw3 + item.tw4), 0)
  const approvedActivities = data.filter((item) => item.status === "approved").length
  const draftActivities = data.filter((item) => item.status === "draft").length
  const submittedActivities = data.filter((item) => item.status === "submitted").length

  const stats = [
    {
      title: "Total Kegiatan",
      value: totalActivities,
      icon: BarChart3,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Anggaran",
      value: formatCurrency(totalBudget),
      icon: DollarSign,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Disetujui",
      value: approvedActivities,
      icon: TrendingUp,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Draft",
      value: draftActivities,
      icon: FileText,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions and Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Info Section */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Tahun Anggaran 2025
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Menampilkan {data.length} dari {totalActivities} kegiatan
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportExcel}
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Status Distribution */}
          {totalActivities > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <span className="text-sm font-medium text-gray-700">Status Distribusi:</span>
                <div className="flex flex-wrap gap-2">
                  {submittedActivities > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {submittedActivities} Diajukan
                    </Badge>
                  )}
                  {approvedActivities > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {approvedActivities} Disetujui
                    </Badge>
                  )}
                  {draftActivities > 0 && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {draftActivities} Draft
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
