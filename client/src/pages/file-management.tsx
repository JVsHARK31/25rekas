import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CloudUpload } from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import FileUpload from "@/components/files/file-upload";
import FileGrid from "@/components/files/file-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { FileItem } from "@/types/rkas";

export default function FileManagement() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: files, isLoading } = useQuery<FileItem[]>({
    queryKey: ['/api/files'],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="erkas-loading h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-erkas-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">File Management</h2>
              <p className="text-erkas-secondary">Kelola dokumen pendukung RKAS</p>
            </div>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-erkas-primary text-white hover:bg-blue-700">
                  <CloudUpload className="mr-2" size={16} />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Dokumen</DialogTitle>
                </DialogHeader>
                <FileUpload onSuccess={() => setIsUploadDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Upload Area */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-erkas-primary transition-colors cursor-pointer"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CloudUpload className="text-2xl text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Dokumen</h3>
                <p className="text-erkas-secondary mb-4">Drag & drop files atau klik untuk browse</p>
                <p className="text-xs text-slate-500">Supported: JPG, PNG, PDF, DOCX (Max: 10MB)</p>
                <Button className="mt-4 bg-erkas-primary text-white hover:bg-blue-700">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Dokumen Terpilih</h3>
                  <div className="flex items-center space-x-4">
                    <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Semua Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        <SelectItem value="RAB">RAB</SelectItem>
                        <SelectItem value="TOR">TOR</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Documentation">Documentation</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder="Cari file..."
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      className="w-64"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="erkas-loading h-8 w-8" />
                  </div>
                ) : (
                  <FileGrid files={files || []} filters={filters} />
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
