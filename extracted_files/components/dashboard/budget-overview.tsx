"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

export function BudgetOverview() {
  const budgetData = [
    {
      name: "BOP Alokasi Dasar",
      allocated: 2500000000,
      used: 1625000000,
      percentage: 65,
      status: "normal",
    },
    {
      name: "BOS Reguler",
      allocated: 1800000000,
      used: 1260000000,
      percentage: 70,
      status: "normal",
    },
    {
      name: "DAK Fisik",
      allocated: 3200000000,
      used: 1920000000,
      percentage: 60,
      status: "normal",
    },
    {
      name: "Bantuan Pemerintah Daerah",
      allocated: 800000000,
      used: 680000000,
      percentage: 85,
      status: "high",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      default:
        return "text-green-600"
    }
  }

  const getStatusBadge = (status: string, percentage: number) => {
    if (percentage >= 80) return <Badge variant="destructive">Tinggi</Badge>
    if (percentage >= 60) return <Badge variant="default">Normal</Badge>
    return <Badge variant="secondary">Rendah</Badge>
  }

  const totalAllocated = budgetData.reduce((sum, item) => sum + item.allocated, 0)
  const totalUsed = budgetData.reduce((sum, item) => sum + item.used, 0)
  const overallPercentage = (totalUsed / totalAllocated) * 100

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Summary Card */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-600" />
            Ringkasan Anggaran
          </CardTitle>
          <CardDescription>Total anggaran dan realisasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Total Dialokasikan</span>
              <span className="text-sm font-bold text-green-600">{formatCurrency(totalAllocated)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Total Digunakan</span>
              <span className="text-sm font-bold text-blue-600">{formatCurrency(totalUsed)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Sisa Anggaran</span>
              <span className="text-sm font-bold text-gray-600">{formatCurrency(totalAllocated - totalUsed)}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Persentase Penggunaan</span>
              <span className="text-sm font-bold">{overallPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={overallPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Budget Details */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
            Detail Anggaran per Sumber Dana
          </CardTitle>
          <CardDescription>Monitoring penggunaan anggaran berdasarkan sumber dana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.used)} dari {formatCurrency(item.allocated)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(item.status, item.percentage)}
                    <span className={`text-sm font-bold ${getStatusColor(item.status)}`}>{item.percentage}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={item.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Sisa: {formatCurrency(item.allocated - item.used)}</span>
                    <span>
                      {item.percentage >= 80 ? (
                        <span className="flex items-center text-red-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Perhatian
                        </span>
                      ) : (
                        <span className="flex items-center text-green-600">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Normal
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
