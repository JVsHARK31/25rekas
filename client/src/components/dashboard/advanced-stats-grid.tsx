import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PeriodType, Quarter, Month } from "./period-selector";

interface AdvancedStatsGridProps {
  periodType: PeriodType;
  selectedQuarter?: Quarter;
  selectedMonth?: Month;
  selectedYear: number;
}

interface StatCardData {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    period: string;
  };
  progress?: number;
}

export default function AdvancedStatsGrid({ 
  periodType, 
  selectedQuarter, 
  selectedMonth, 
  selectedYear 
}: AdvancedStatsGridProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate period-specific stats
  const getPeriodStats = () => {
    const baseStats = {
      totalActivities: 45,
      totalBudget: 2850000000,
      approvedActivities: 32,
      pendingActivities: 8,
      realizedBudget: 1995000000,
      lateActivities: 3,
      targetAchievement: 87,
      todayActivity: 12
    };

    // Apply period-specific multipliers for realistic variation
    let multiplier = 1;
    if (periodType === 'quarterly') {
      switch (selectedQuarter) {
        case 'TW1': multiplier = 0.8; break;
        case 'TW2': multiplier = 1.0; break;
        case 'TW3': multiplier = 1.2; break;
        case 'TW4': multiplier = 0.9; break;
      }
    } else if (periodType === 'monthly' && selectedMonth) {
      // Seasonal variation for months
      const monthMultipliers = [0.7, 0.8, 0.9, 1.1, 1.2, 1.0, 0.8, 0.7, 1.1, 1.3, 1.1, 0.9];
      multiplier = monthMultipliers[selectedMonth - 1];
    }

    return {
      totalActivities: Math.round(baseStats.totalActivities * multiplier),
      totalBudget: Math.round(baseStats.totalBudget * multiplier),
      approvedActivities: Math.round(baseStats.approvedActivities * multiplier),
      pendingActivities: Math.round(baseStats.pendingActivities * multiplier),
      realizedBudget: Math.round(baseStats.realizedBudget * multiplier),
      lateActivities: Math.max(0, Math.round(baseStats.lateActivities * multiplier * 0.8)),
      targetAchievement: Math.min(100, Math.round(baseStats.targetAchievement * multiplier)),
      todayActivity: Math.round(baseStats.todayActivity * (0.5 + multiplier * 0.5))
    };
  };

  const stats = getPeriodStats();
  const realizationPercentage = (stats.realizedBudget / stats.totalBudget) * 100;

  const getTrendData = (baseValue: number) => {
    const change = Math.floor(Math.random() * 20) - 10; // -10 to +10
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      period: periodType === 'quarterly' ? 'vs triwulan lalu' : 'vs bulan lalu'
    } as const;
  };

  const statsData: StatCardData[] = [
    {
      title: "Total Kegiatan",
      value: stats.totalActivities,
      description: "Kegiatan RKAS terdaftar",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: getTrendData(stats.totalActivities),
      progress: undefined
    },
    {
      title: "Total Anggaran",
      value: formatCurrency(stats.totalBudget),
      description: "Anggaran keseluruhan",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: getTrendData(stats.totalBudget),
      progress: undefined
    },
    {
      title: "Kegiatan Disetujui",
      value: stats.approvedActivities,
      description: "Sudah mendapat persetujuan",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: getTrendData(stats.approvedActivities),
      progress: (stats.approvedActivities / stats.totalActivities) * 100
    },
    {
      title: "Menunggu Persetujuan",
      value: stats.pendingActivities,
      description: "Dalam proses review",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: getTrendData(stats.pendingActivities),
      progress: undefined
    },
    {
      title: "Realisasi Anggaran",
      value: formatCurrency(stats.realizedBudget),
      description: `${realizationPercentage.toFixed(1)}% dari total`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: getTrendData(stats.realizedBudget),
      progress: realizationPercentage
    },
    {
      title: "Kegiatan Terlambat",
      value: stats.lateActivities,
      description: "Perlu perhatian khusus",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: getTrendData(stats.lateActivities),
      progress: undefined
    },
    {
      title: "Target Capaian",
      value: `${stats.targetAchievement}%`,
      description: `Target ${periodType === 'quarterly' ? 'triwulan' : 'bulan'} ini`,
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      trend: getTrendData(stats.targetAchievement),
      progress: stats.targetAchievement
    },
    {
      title: "Aktivitas Hari Ini",
      value: stats.todayActivity,
      description: "Update dan perubahan",
      icon: Zap,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      trend: getTrendData(stats.todayActivity),
      progress: undefined
    }
  ];

  const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'stable' }) => {
    switch (direction) {
      case 'up': return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'down': return <ArrowDown className="h-3 w-3 text-red-600" />;
      default: return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                  <div className={cn("text-2xl font-bold", stat.color)}>
                    {stat.value}
                  </div>
                </div>
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </div>

              {/* Description and Trend */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500">{stat.description}</p>
                
                {stat.trend && (
                  <div className="flex items-center space-x-1">
                    <TrendIcon direction={stat.trend.direction} />
                    <span className={cn(
                      "text-xs font-medium",
                      stat.trend.direction === 'up' ? 'text-green-600' :
                      stat.trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                    )}>
                      {stat.trend.value}%
                    </span>
                    <span className="text-xs text-gray-500">{stat.trend.period}</span>
                  </div>
                )}

                {/* Progress Bar */}
                {stat.progress !== undefined && (
                  <div className="space-y-1">
                    <Progress value={stat.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{stat.progress.toFixed(1)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}