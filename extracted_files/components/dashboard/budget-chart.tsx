"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { supabase } from "@/lib/supabase"
import { DollarSign } from "lucide-react"

export function BudgetChart() {
  const [chartData, setChartData] = useState([])
  const [pieData, setPieData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChartData()
  }, [])

  const loadChartData = async () => {
    try {
      const { data } = await supabase.from("rkas_activities").select(`
        tw1, tw2, tw3, tw4,
        rkas_bidang(nama_bidang),
        rkas_dana(nama_dana)
      `)

      if (data) {
        // Group by bidang for bar chart
        const groupedByBidang = data.reduce((acc, item) => {
          const bidang = item.rkas_bidang?.nama_bidang || "Tidak Diketahui"
          if (!acc[bidang]) {
            acc[bidang] = { bidang, tw1: 0, tw2: 0, tw3: 0, tw4: 0, total: 0 }
          }
          acc[bidang].tw1 += item.tw1 || 0
          acc[bidang].tw2 += item.tw2 || 0
          acc[bidang].tw3 += item.tw3 || 0
          acc[bidang].tw4 += item.tw4 || 0
          acc[bidang].total += (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0)
          return acc
        }, {})

        // Group by dana for pie chart
        const groupedByDana = data.reduce((acc, item) => {
          const dana = item.rkas_dana?.nama_dana || "Tidak Diketahui"
          if (!acc[dana]) {
            acc[dana] = { name: dana, value: 0 }
          }
          acc[dana].value += (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0)
          return acc
        }, {})

        setChartData(Object.values(groupedByBidang))
        setPieData(Object.values(groupedByDana))
      }
    } catch (error) {
      console.error("Error loading chart data:", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#6B7280", "#EC4899", "#14B8A6"]

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Distribusi Anggaran
        </CardTitle>
        <CardDescription>Anggaran per bidang dan sumber dana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Bidang */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gray-700">Anggaran per Bidang</h4>
            <ChartContainer
              config={{
                total: {
                  label: "Total Anggaran",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bidang" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [
                      new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(value as number),
                      "Total Anggaran",
                    ]}
                  />
                  <Bar dataKey="total" fill="var(--color-total)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Pie Chart - Sumber Dana */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gray-700">Anggaran per Sumber Dana</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  formatter={(value) => [
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(value as number),
                    "Anggaran",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-1 gap-1 mt-4">
              {pieData.map((entry: any, index) => (
                <div key={index} className="flex items-center text-xs">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
