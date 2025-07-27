import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  FileText as FilePdf,
  Mail
} from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { DashboardStats } from "@/types/rkas";

export default function Reports() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="erkas-loading h-8 w-8" />
      </div>
    );
  }

  const reportTypes = [
    {
      id: 'budget-summary',
      title: 'Laporan Ringkasan Anggaran',
      description: 'Ringkasan alokasi dan realisasi anggaran per bidang',
      icon: BarChart,
      color: 'bg-blue-100 text-blue-600',
      format: ['PDF', 'Excel']
    },
    {
      id: 'quarterly-report',
      title: 'Laporan Triwulan',
      description: 'Laporan realisasi anggaran per triwulan',
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
      format: ['PDF', 'Excel']
    },
    {
      id: 'activity-detail',
      title: 'Detail Kegiatan',
      description: 'Laporan detail seluruh kegiatan dan status',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      format: ['PDF', 'Excel', 'Word']
    },
    {
      id: 'financial-analysis',
      title: 'Analisis Keuangan',
      description: 'Analisis mendalam penggunaan anggaran',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
      format: ['PDF']
    },
    {
      id: 'budget-variance',
      title: 'Laporan Varians Anggaran',
      description: 'Perbandingan rencana vs realisasi anggaran',
      icon: PieChart,
      color: 'bg-red-100 text-red-600',
      format: ['PDF', 'Excel']
    },
    {
      id: 'audit-trail',
      title: 'Jejak Audit',
      description: 'Log aktivitas dan perubahan sistem',
      icon: FileText,
      color: 'bg-gray-100 text-gray-600',
      format: ['PDF', 'Excel']
    }
  ];

  const handleGenerateReport = (reportId: string, format: string) => {
    // This would typically trigger a report generation
    console.log(`Generating ${reportId} in ${format} format`);
    // For now, show a placeholder download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${reportId}-${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-erkas-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Reports & Analytics</h2>
            <p className="text-erkas-secondary">Generate comprehensive reports for budget analysis and compliance</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Reports Generated</p>
                    <div className="text-2xl font-bold text-slate-900">24</div>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">This Month</p>
                    <div className="text-2xl font-bold text-slate-900">8</div>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="text-green-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Auto Scheduled</p>
                    <div className="text-2xl font-bold text-slate-900">3</div>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Mail className="text-purple-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Total Downloads</p>
                    <div className="text-2xl font-bold text-slate-900">156</div>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Download className="text-orange-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Generation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div key={report.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${report.color}`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-2">{report.title}</h3>
                          <p className="text-sm text-erkas-secondary mb-4">{report.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {report.format.map((format) => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex space-x-2">
                            {report.format.map((format) => {
                              const formatIcon = format === 'PDF' ? FilePdf : FileSpreadsheet;
                              const FormatIcon = formatIcon;
                              return (
                                <Button
                                  key={format}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleGenerateReport(report.id, format)}
                                  className="text-xs"
                                >
                                  <FormatIcon className="mr-1" size={12} />
                                  {format}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Laporan Ringkasan Anggaran Q4 2024', date: '2024-12-15', format: 'PDF', size: '2.4 MB' },
                  { name: 'Detail Kegiatan November 2024', date: '2024-12-01', format: 'Excel', size: '1.8 MB' },
                  { name: 'Analisis Keuangan TW4', date: '2024-11-28', format: 'PDF', size: '3.1 MB' },
                  { name: 'Laporan Varians Anggaran Q3', date: '2024-11-15', format: 'Excel', size: '2.2 MB' },
                  { name: 'Jejak Audit Oktober 2024', date: '2024-11-01', format: 'PDF', size: '1.5 MB' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {report.format === 'PDF' ? (
                          <FilePdf className="text-red-600" size={20} />
                        ) : (
                          <FileSpreadsheet className="text-green-600" size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{report.name}</h4>
                        <p className="text-sm text-erkas-secondary">{report.date} • {report.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button size="sm" variant="ghost">
                        <Download size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Scheduled Reports
                <Button size="sm" className="bg-erkas-primary text-white">
                  <Calendar className="mr-2" size={16} />
                  Schedule New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Monthly Budget Summary', frequency: 'Monthly', nextRun: '2025-01-01', format: 'PDF' },
                  { name: 'Quarterly Analysis', frequency: 'Quarterly', nextRun: '2025-01-15', format: 'Excel' },
                  { name: 'Annual Compliance Report', frequency: 'Yearly', nextRun: '2025-12-31', format: 'PDF' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">{schedule.name}</h4>
                      <p className="text-sm text-erkas-secondary">
                        {schedule.frequency} • Next: {schedule.nextRun}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{schedule.format}</Badge>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}