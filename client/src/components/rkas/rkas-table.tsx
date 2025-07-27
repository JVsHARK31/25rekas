import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Check, Trash2, Eye, Paperclip, History, ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { RkasActivity } from "@/types/rkas";
import { sampleFields, sampleStandards } from "@/data/sample-rkas";
import { AuthService } from "@/lib/auth";

interface RkasTableProps {
  activities: RkasActivity[];
  filters: {
    bidang: string;
    dana: string;
    status: string;
    search: string;
  };
}

export default function RkasTable({ activities, filters }: RkasTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [expandedFields] = useState<string[]>(["field-1"]); // Default expand first field
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RkasActivity> }) => {
      const response = await apiRequest('PUT', `/api/rkas/activities/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rkas/activities'] });
      toast({
        title: "Berhasil",
        description: "Data kegiatan berhasil diperbarui",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal memperbarui data",
        variant: "destructive",
      });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/rkas/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rkas/activities'] });
      toast({
        title: "Berhasil",
        description: "Kegiatan berhasil dihapus",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menghapus kegiatan",
        variant: "destructive",
      });
    },
  });

  // Filter activities based on search and filters
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !filters.search || 
      activity.namaGiat.toLowerCase().includes(filters.search.toLowerCase()) ||
      activity.kodeGiat.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || activity.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const handleCellEdit = (activityId: string, field: string, value: string) => {
    updateActivityMutation.mutate({
      id: activityId,
      data: { [field]: value }
    });
    setEditingCell(null);
  };

  const handleDelete = (activityId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
      deleteActivityMutation.mutate(activityId);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredActivities.map(a => a.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (activityId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, activityId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== activityId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: "Draft", className: "status-draft" },
      submitted: { label: "Submitted", className: "status-submitted" },
      review: { label: "Review", className: "status-review" },
      approved: { label: "Approved", className: "status-approved" },
      rejected: { label: "Rejected", className: "status-rejected" },
    };
    
    const statusConfig = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge className={statusConfig.className}>{statusConfig.label}</Badge>;
  };

  const getDanaBadge = (namaDana: string) => {
    const colorMap: { [key: string]: string } = {
      "BOP": "bg-blue-100 text-blue-800",
      "BOS": "bg-green-100 text-green-800",
      "DAK": "bg-purple-100 text-purple-800",
    };
    
    const type = namaDana.split(' ')[0];
    const colorClass = colorMap[type] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {namaDana}
      </Badge>
    );
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const canEdit = AuthService.canEdit();
  const canDelete = AuthService.canDelete();

  return (
    <div className="overflow-x-auto erkas-scrollbar">
      <table className="erkas-table">
        <thead>
          <tr>
            <th className="w-8">
              <Checkbox
                checked={selectedRows.length === filteredActivities.length && filteredActivities.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th>Kode</th>
            <th className="min-w-[300px]">Kegiatan</th>
            <th>Sumber Dana</th>
            <th className="text-center">TW 1</th>
            <th className="text-center">TW 2</th>
            <th className="text-center">TW 3</th>
            <th className="text-center">TW 4</th>
            <th className="text-center">Total</th>
            <th className="text-center">Status</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* Bidang Header Row */}
          <tr className="bg-blue-50 font-medium">
            <td>
              <ChevronDown className="text-slate-400" size={16} />
            </td>
            <td className="text-erkas-primary font-semibold">01</td>
            <td className="text-erkas-primary font-semibold">KURIKULUM</td>
            <td colSpan={8}></td>
          </tr>
          
          {/* Standar Row */}
          <tr className="bg-slate-25">
            <td className="pl-8">
              <ChevronRight className="text-slate-400" size={16} />
            </td>
            <td className="text-slate-600">2</td>
            <td className="text-slate-700 font-medium">Pengembangan Standar Isi</td>
            <td colSpan={8}></td>
          </tr>
          
          {/* Activity Rows */}
          {filteredActivities.map((activity) => (
            <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
              <td>
                <Checkbox
                  checked={selectedRows.includes(activity.id)}
                  onCheckedChange={(checked) => handleSelectRow(activity.id, checked as boolean)}
                />
              </td>
              <td className="font-mono text-xs text-slate-600">{activity.kodeGiat}</td>
              <td>
                <div>
                  <p className="font-medium text-slate-900">{activity.namaGiat}</p>
                  {activity.subtitle && (
                    <p className="text-xs text-erkas-secondary mt-1">{activity.subtitle}</p>
                  )}
                </div>
              </td>
              <td>{getDanaBadge(activity.namaDana)}</td>
              
              {/* Quarterly budget cells */}
              {(['tw1', 'tw2', 'tw3', 'tw4'] as const).map((quarter) => (
                <td key={quarter} className="text-center">
                  {editingCell === `${activity.id}-${quarter}` && canEdit ? (
                    <Input
                      type="text"
                      defaultValue={formatCurrency(activity[quarter])}
                      className="w-20 text-center text-xs"
                      onBlur={(e) => handleCellEdit(activity.id, quarter, e.target.value.replace(/,/g, ''))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCellEdit(activity.id, quarter, e.currentTarget.value.replace(/,/g, ''));
                        }
                        if (e.key === 'Escape') {
                          setEditingCell(null);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <div
                      className={`text-xs px-2 py-1 rounded ${canEdit ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                      onClick={() => canEdit && setEditingCell(`${activity.id}-${quarter}`)}
                    >
                      {formatCurrency(activity[quarter])}
                    </div>
                  )}
                </td>
              ))}
              
              <td className="text-center font-semibold text-slate-900">
                {formatCurrency(activity.total)}
              </td>
              <td className="text-center">{getStatusBadge(activity.status)}</td>
              <td className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {canEdit && (
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-erkas-primary">
                      <Edit size={14} />
                    </Button>
                  )}
                  {canEdit && activity.status === 'draft' && (
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-erkas-success">
                      <Check size={14} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-500">
                    <Eye size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-500">
                    <Paperclip size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-yellow-500">
                    <History size={14} />
                  </Button>
                  {canDelete && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-red-500"
                      onClick={() => handleDelete(activity.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-erkas-secondary">
          Menampilkan <span className="font-medium text-slate-900">1-{filteredActivities.length}</span> dari{" "}
          <span className="font-medium text-slate-900">{filteredActivities.length}</span> kegiatan
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            ←
          </Button>
          <Button size="sm" className="bg-erkas-primary text-white">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            →
          </Button>
        </div>
      </div>
    </div>
  );
}
