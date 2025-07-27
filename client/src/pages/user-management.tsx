import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import UserTable from "@/components/users/user-table";
import AddUserForm from "@/components/users/add-user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types/rkas";
import { AuthService } from "@/lib/auth";

export default function UserManagement() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  // Check if user has admin privileges
  useEffect(() => {
    if (!authLoading && isAuthenticated && !AuthService.hasRole('super_admin')) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    enabled: isAuthenticated && AuthService.hasRole('super_admin'),
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="erkas-loading h-8 w-8" />
      </div>
    );
  }

  if (!AuthService.hasRole('super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-erkas-secondary">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeUsers = users?.filter(user => user.isActive) || [];
  const pendingUsers = users?.filter(user => !user.isActive) || [];

  return (
    <div className="min-h-screen bg-erkas-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">User Management</h2>
              <p className="text-erkas-secondary">Kelola akses pengguna sistem eRKAS</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-erkas-primary text-white hover:bg-blue-700">
                  <UserPlus className="mr-2" size={16} />
                  Tambah User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                </DialogHeader>
                <AddUserForm onSuccess={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="erkas-loading h-6 w-12" />
                      ) : (
                        users?.length || 0
                      )}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <UserPlus className="text-erkas-primary" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Active Users</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="erkas-loading h-6 w-12" />
                      ) : (
                        activeUsers.length
                      )}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <UserPlus className="text-erkas-success" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-erkas-secondary mb-1">Pending Approval</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="erkas-loading h-6 w-8" />
                      ) : (
                        pendingUsers.length
                      )}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <UserPlus className="text-yellow-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="erkas-loading h-8 w-8" />
                </div>
              ) : (
                <UserTable users={users || []} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
