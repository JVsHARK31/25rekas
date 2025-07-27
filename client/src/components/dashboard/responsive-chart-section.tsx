import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Maximize2,
  Calendar,
  FileText,
  DollarSign,
  Users,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PeriodType, Quarter, Month } from "./period-selector";

interface ResponsiveChartSectionProps {
  periodType: PeriodType;
  selectedQuarter?: Quarter;
  selectedMonth?: Month;
  selectedYear: number;
}

type ChartType = 'budget' | 'activities' | 'realization' | 'comparison';

const chartTypes = [
  { value: 'budget', label: 'Alokasi Anggaran', icon: DollarSign, color: 'bg-green-500' },
  { value: 'activities', label: 'Status Kegiatan', icon: FileText, color: 'bg-blue-500' },
  { value: 'realization', label: 'Realisasi Periode', icon: TrendingUp, color: 'bg-purple-500' },
  { value: 'comparison', label: 'Perbandingan Bidang', icon: BarChart3, color: 'bg-orange-500' }
];

export default function ResponsiveChartSection({
  periodType,
  selectedQuarter,
  selectedMonth,
  selectedYear
}: ResponsiveChartSectionProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>('budget');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(amount);
  };

  const getPeriodLabel = () => {
    if (periodType === 'quarterly' && selectedQuarter) {
      const quarterLabels = {
        'TW1': 'Triwulan 1',
        'TW2': 'Triwulan 2', 
        'TW3': 'Triwulan 3',
        'TW4': 'Triwulan 4'
      };
      return `${quarterLabels[selectedQuarter]} ${selectedYear}`;
    } else if (periodType === 'monthly' && selectedMonth) {
      const monthLabels = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${monthLabels[selectedMonth - 1]} ${selectedYear}`;
    }
    return `Tahun ${selectedYear}`;
  };

  const getMockChartData = () => {
    const bidangData = [
      { name: 'Kurikulum', value: 850000000, activities: 12, color: '#3B82F6' },
      { name: 'Kesiswaan', value: 650000000, activities: 8, color: '#10B981' },
      { name: 'Sarana Prasarana', value: 1200000000, activities: 15, color: '#F59E0B' },
      { name: 'Pendidik & Tenaga', value: 750000000, activities: 10, color: '#EF4444' },
      { name: 'Pembiayaan', value: 450000000, activities: 6, color: '#8B5CF6' },
      { name: 'Budaya Sekolah', value: 300000000, activities: 4, color: '#06B6D4' },
      { name: 'Kemitraan', value: 200000000, activities: 3, color: '#F97316' },
      { name: 'Evaluasi', value: 150000000, activities: 2, color: '#84CC16' }
    ];

    return bidangData;
  };

  const chartData = getMockChartData();
  const currentChart = chartTypes.find(chart => chart.value === selectedChart);

  const renderChart = () => {
    switch (selectedChart) {
      case 'budget':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Allocation Bars */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Alokasi per Bidang</h4>
                {chartData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-gray-600">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{
                          backgroundColor: item.color,
                          width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Budget Summary */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Ringkasan Anggaran</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0))}
                    </p>
                    <p className="text-sm text-blue-700">Total Anggaran</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {chartData.reduce((sum, item) => sum + item.activities, 0)}
                    </p>
                    <p className="text-sm text-green-700">Total Kegiatan</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0) * 0.73)}
                  </p>
                  <p className="text-sm text-purple-700">Estimasi Realisasi (73%)</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'activities':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chartData.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Badge variant="secondary">{item.activities}</Badge>
                  </div>
                  <h5 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h5>
                  <p className="text-xs text-gray-600">{formatCurrency(item.value)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'realization':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Realization Progress */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Progress Realisasi</h4>
                {chartData.slice(0, 5).map((item, index) => {
                  const realization = 45 + Math.random() * 40; // 45-85%
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-600">{realization.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-green-500"
                          style={{ width: `${realization}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Target vs Actual */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Target vs Aktual</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">73.2%</p>
                    <p className="text-sm text-green-700">Realisasi Aktual</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">80.0%</p>
                    <p className="text-sm text-blue-700">Target Periode</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <p className="text-lg font-bold text-orange-600">-6.8%</p>
                    <p className="text-sm text-orange-700">Selisih</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current vs Previous Period */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">
                Perbandingan dengan {periodType === 'quarterly' ? 'Triwulan' : 'Bulan'} Sebelumnya
              </h4>
              {chartData.slice(0, 6).map((item, index) => {
                const change = (Math.random() - 0.5) * 30; // -15% to +15%
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "text-sm font-medium",
                        change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
                      )}>
                        {change > 0 ? "+" : ""}{change.toFixed(1)}%
                      </span>
                      <TrendingUp className={cn(
                        "h-4 w-4",
                        change > 0 ? "text-green-600 rotate-0" : 
                        change < 0 ? "text-red-600 rotate-180" : "text-gray-600"
                      )} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Year to Date Comparison */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Perbandingan Year-to-Date</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0) * 0.68)}
                  </p>
                  <p className="text-sm text-blue-700">Total YTD</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-lg font-bold text-green-600">+12.3%</p>
                  <p className="text-sm text-green-700">vs Tahun Lalu</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-700">Progress Tahunan</div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>68% tercapai</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn("mb-6", isFullscreen && "fixed inset-4 z-50 overflow-auto")}>
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold text-gray-900">
              Analisis Data RKAS
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{getPeriodLabel()}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chart Type Selector */}
            <Select value={selectedChart} onValueChange={(value) => setSelectedChart(value as ChartType)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map(chart => (
                  <SelectItem key={chart.value} value={chart.value}>
                    <div className="flex items-center space-x-2">
                      <chart.icon className="h-4 w-4" />
                      <span>{chart.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chart Type Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {chartTypes.map(chart => (
            <Button
              key={chart.value}
              variant={selectedChart === chart.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChart(chart.value as ChartType)}
              className="flex items-center space-x-2"
            >
              <chart.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{chart.label}</span>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {renderChart()}
      </CardContent>
    </Card>
  );
}