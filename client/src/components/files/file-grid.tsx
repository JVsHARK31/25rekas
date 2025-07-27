import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Download, Trash2, FileText, Image, File as FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileItem } from "@/types/rkas";
import { AuthService } from "@/lib/auth";

interface FileGridProps {
  files: FileItem[];
  filters: {
    category: string;
    search: string;
  };
}

export default function FileGrid({ files, filters }: FileGridProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteFileMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      toast({
        title: "Berhasil",
        description: "File berhasil dihapus",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menghapus file",
        variant: "destructive",
      });
    },
  });

  // Filter files based on search and category
  const filteredFiles = files.filter(file => {
    const matchesSearch = !filters.search || 
      file.originalName.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || file.category === filters.category;
    
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="text-red-600" size={24} />;
      case 'docx':
        return <FileText className="text-blue-600" size={24} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="text-green-600" size={24} />;
      default:
        return <FileIcon className="text-gray-600" size={24} />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'docx':
        return 'bg-blue-100 text-blue-800';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleView = (file: FileItem) => {
    // TODO: Implement file viewer functionality
    toast({
      title: "Info",
      description: "File viewer akan segera tersedia",
    });
  };

  const handleDownload = (file: FileItem) => {
    // TODO: Implement file download functionality
    const link = document.createElement('a');
    link.href = `/api/files/download/${file.id}`;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (fileId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus file ini?")) {
      deleteFileMutation.mutate(fileId);
    }
  };

  const canDelete = AuthService.canDelete();

  if (filteredFiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <FileIcon className="text-slate-400" size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Tidak ada file</h3>
        <p className="text-erkas-secondary">
          {filters.search || filters.category 
            ? "Tidak ada file yang sesuai dengan filter"
            : "Belum ada file yang diunggah"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredFiles.map((file) => (
        <div key={file.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              {getFileIcon(file.fileType)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate" title={file.originalName}>
                {file.originalName}
              </p>
              <p className="text-xs text-erkas-secondary">{formatFileSize(file.fileSize)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-erkas-secondary mb-3">
            <div className="flex items-center space-x-2">
              {file.category && (
                <Badge className="text-xs" variant="secondary">
                  {file.category}
                </Badge>
              )}
              <Badge className={`text-xs ${getFileTypeColor(file.fileType)}`}>
                {file.fileType.toUpperCase()}
              </Badge>
            </div>
            <span>{formatDate(file.createdAt)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs text-erkas-primary border-erkas-primary hover:bg-blue-50"
              onClick={() => handleView(file)}
            >
              <Eye className="mr-1" size={12} />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs text-erkas-success border-erkas-success hover:bg-green-50"
              onClick={() => handleDownload(file)}
            >
              <Download className="mr-1" size={12} />
              Download
            </Button>
            {canDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-slate-400 hover:text-red-500"
                onClick={() => handleDelete(file.id)}
              >
                <Trash2 size={12} />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
