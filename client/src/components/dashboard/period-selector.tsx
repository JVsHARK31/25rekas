import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export type PeriodType = 'quarterly' | 'monthly';
export type Quarter = 'TW1' | 'TW2' | 'TW3' | 'TW4';
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface PeriodSelectorProps {
  selectedPeriodType: PeriodType;
  selectedQuarter?: Quarter;
  selectedMonth?: Month;
  selectedYear: number;
  onPeriodTypeChange: (type: PeriodType) => void;
  onQuarterChange: (quarter: Quarter) => void;
  onMonthChange: (month: Month) => void;
  onYearChange: (year: number) => void;
}

const quarters = [
  { value: 'TW1', label: 'Triwulan 1', period: 'Jan - Mar', color: 'bg-blue-500' },
  { value: 'TW2', label: 'Triwulan 2', period: 'Apr - Jun', color: 'bg-green-500' },
  { value: 'TW3', label: 'Triwulan 3', period: 'Jul - Sep', color: 'bg-orange-500' },
  { value: 'TW4', label: 'Triwulan 4', period: 'Okt - Des', color: 'bg-purple-500' }
];

const months = [
  { value: 1, label: 'Januari', short: 'Jan', color: 'bg-indigo-500' },
  { value: 2, label: 'Februari', short: 'Feb', color: 'bg-blue-500' },
  { value: 3, label: 'Maret', short: 'Mar', color: 'bg-cyan-500' },
  { value: 4, label: 'April', short: 'Apr', color: 'bg-emerald-500' },
  { value: 5, label: 'Mei', short: 'Mei', color: 'bg-green-500' },
  { value: 6, label: 'Juni', short: 'Jun', color: 'bg-lime-500' },
  { value: 7, label: 'Juli', short: 'Jul', color: 'bg-yellow-500' },
  { value: 8, label: 'Agustus', short: 'Agu', color: 'bg-orange-500' },
  { value: 9, label: 'September', short: 'Sep', color: 'bg-red-500' },
  { value: 10, label: 'Oktober', short: 'Okt', color: 'bg-pink-500' },
  { value: 11, label: 'November', short: 'Nov', color: 'bg-purple-500' },
  { value: 12, label: 'Desember', short: 'Des', color: 'bg-violet-500' }
];

const years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

export default function PeriodSelector({
  selectedPeriodType,
  selectedQuarter,
  selectedMonth,
  selectedYear,
  onPeriodTypeChange,
  onQuarterChange,
  onMonthChange,
  onYearChange
}: PeriodSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filter Periode</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1"
            >
              <span className="text-sm">
                {isExpanded ? 'Sembunyikan' : 'Tampilkan'} Opsi
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
            </Button>
          </div>

          {/* Current Selection Summary */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Tahun {selectedYear}</span>
            </Badge>
            
            {selectedPeriodType === 'quarterly' && selectedQuarter && (
              <Badge className={cn("text-white", quarters.find(q => q.value === selectedQuarter)?.color)}>
                <Clock className="h-3 w-3 mr-1" />
                {quarters.find(q => q.value === selectedQuarter)?.label}
              </Badge>
            )}
            
            {selectedPeriodType === 'monthly' && selectedMonth && (
              <Badge className={cn("text-white", months.find(m => m.value === selectedMonth)?.color)}>
                <Calendar className="h-3 w-3 mr-1" />
                {months.find(m => m.value === selectedMonth)?.label}
              </Badge>
            )}
          </div>

          {/* Expanded Controls */}
          {isExpanded && (
            <div className="space-y-6 pt-4 border-t border-gray-200">
              {/* Year Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Anggaran
                </label>
                <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        Tahun {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Period Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Jenis Periode
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedPeriodType === 'quarterly' ? 'default' : 'outline'}
                    onClick={() => onPeriodTypeChange('quarterly')}
                    className="flex items-center space-x-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Triwulan</span>
                  </Button>
                  <Button
                    variant={selectedPeriodType === 'monthly' ? 'default' : 'outline'}
                    onClick={() => onPeriodTypeChange('monthly')}
                    className="flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Bulanan</span>  
                  </Button>
                </div>
              </div>

              {/* Quarter Selection */}
              {selectedPeriodType === 'quarterly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Triwulan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {quarters.map(quarter => (
                      <Button
                        key={quarter.value}
                        variant={selectedQuarter === quarter.value ? 'default' : 'outline'}
                        onClick={() => onQuarterChange(quarter.value as Quarter)}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 h-auto space-y-1",
                          selectedQuarter === quarter.value && quarter.color
                        )}
                      >
                        <span className="font-semibold">{quarter.label}</span>
                        <span className="text-xs opacity-80">{quarter.period}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Month Selection */}
              {selectedPeriodType === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Bulan
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                    {months.map(month => (
                      <Button
                        key={month.value}
                        variant={selectedMonth === month.value ? 'default' : 'outline'}
                        onClick={() => onMonthChange(month.value as Month)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 h-auto space-y-1 text-xs",
                          selectedMonth === month.value && month.color
                        )}
                      >
                        <span className="font-medium">{month.short}</span>
                        <span className="text-xs opacity-80">{month.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onYearChange(2025);
                    onPeriodTypeChange('quarterly');
                    onQuarterChange('TW1');
                  }}
                >
                  Reset ke TW1 2025
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onYearChange(new Date().getFullYear());
                    onPeriodTypeChange('monthly');
                    onMonthChange((new Date().getMonth() + 1) as Month);
                  }}
                >
                  Bulan Ini
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}