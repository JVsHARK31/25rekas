import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  GitBranch, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  Users,
  Calendar
} from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { RkasActivity } from "@/types/rkas";

export default function Workflow() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: activities, isLoading } = useQuery<RkasActivity[]>({
    queryKey: ['/api/rkas/activities'],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="erkas-loading h-8 w-8" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", icon: Edit },
      submitted: { color: "bg-blue-100 text-blue-800", icon: Clock },
      review: { color: "bg-yellow-100 text-yellow-800", icon: Eye },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} px-2 py-1 flex items-center gap-1`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const workflowStats = {
    draft: activities?.filter(a => a.status === 'draft').length || 0,
    submitted: activities?.filter(a => a.status === 'submitted').length || 0,
    review: activities?.filter(a => a.status === 'review').length || 0,
    approved: activities?.filter(a => a.status === 'approved').length || 0,
    rejected: activities?.filter(a => a.status === 'rejected').length || 0,
  };

  return (
    <div className="min-h-screen bg-erkas-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Workflow Management</h2>
            <p className="text-erkas-secondary">Monitor alur persetujuan dan status kegiatan RKAS</p>
          </div>

          {/* Workflow Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Draft</p>
                    <div className="text-xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="erkas-loading h-5 w-8" />
                      ) : (
                        workflowStats.draft
                      )}
                    </div>
                  </div>
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Edit className="text-gray-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Submitted</p>
                    <div className="text-xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="erkas-loading h-5 w-8" />
                      ) : (
                        workflowStats.submitted
                      )}
                    </div>
                  </div>
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Review</p>
                    <div className="text-xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="erkas-loading h-5 w-8" />
                      ) : (
                        workflowStats.review
                      )}
                    </div>
                  </div>
                  <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Eye className="text-yellow-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Approved</p>
                    <div className="text-xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="erkas-loading h-5 w-8" />
                      ) : (
                        workflowStats.approved
                      )}
                    </div>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Rejected</p>
                    <div className="text-xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="erkas-loading h-5 w-8" />
                      ) : (
                        workflowStats.rejected
                      )}
                    </div>
                  </div>
                  <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="text-red-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitBranch className="mr-2" size={20} />
                Aktivitas Workflow Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="erkas-loading h-4 w-4 rounded-full" />
                        <div className="flex-1">
                          <div className="erkas-loading h-4 w-3/4 mb-2" />
                          <div className="erkas-loading h-3 w-1/2" />
                        </div>
                        <div className="erkas-loading h-6 w-16" />
                      </div>
                    ))}
                  </div>
                ) : activities && activities.length > 0 ? (
                  activities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{activity.namaGiat}</h4>
                        <p className="text-sm text-erkas-secondary">{activity.kodeGiat}</p>
                        <p className="text-sm text-slate-600 mt-1">{formatCurrency(activity.total)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(activity.status)}
                        <div className="text-sm text-erkas-secondary">
                          {new Date(activity.updatedAt).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto text-slate-400 mb-4" size={48} />
                    <p className="text-erkas-secondary">Belum ada aktivitas workflow</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Workflow Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2" size={20} />
                Alur Persetujuan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <Edit className="text-gray-600" size={20} />
                    </div>
                    <p className="text-xs font-medium">Draft</p>
                  </div>
                  <div className="h-0.5 w-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <Clock className="text-blue-600" size={20} />
                    </div>
                    <p className="text-xs font-medium">Submit</p>
                  </div>
                  <div className="h-0.5 w-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                      <Eye className="text-yellow-600" size={20} />
                    </div>
                    <p className="text-xs font-medium">Review</p>
                  </div>
                  <div className="h-0.5 w-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <p className="text-xs font-medium">Approve</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Tahap Review</h4>
                  <p className="text-sm text-erkas-secondary">Kepala Sekolah dan Tim Keuangan melakukan review dokumen RKAS</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Tahap Persetujuan</h4>
                  <p className="text-sm text-erkas-secondary">Komite Sekolah memberikan persetujuan final</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}