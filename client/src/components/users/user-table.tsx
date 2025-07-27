import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Key, UserX, Check, X, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@/types/rkas";

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [filters, setFilters] = useState({
    role: "",
    search: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await apiRequest('PUT', `/api/users/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Berhasil",
        description: "Data pengguna berhasil diperbarui",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal memperbarui data pengguna",
        variant: "destructive",
      });
    },
  });

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.search || 
      user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.username.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRole = !filters.role || user.role === filters.role;
    
    return matchesSearch && matchesRole;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      super_admin: { label: "Super Admin", className: "role-super-admin" },
      operator: { label: "Operator", className: "role-operator" },
      viewer: { label: "Viewer", className: "role-viewer" },
    };
    
    const roleConfig = roleMap[role as keyof typeof roleMap] || roleMap.viewer;
    return <Badge className={roleConfig.className}>{roleConfig.label}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="status-approved">Active</Badge>
    ) : (
      <Badge className="status-draft">Pending</Badge>
    );
  };

  const formatLastLogin = (lastLogin: string | undefined) => {
    if (!lastLogin) return "Never";
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const handleActivateUser = (userId: string) => {
    updateUserMutation.mutate({
      id: userId,
      data: { isActive: true }
    });
  };

  const handleDeactivateUser = (userId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menonaktifkan pengguna ini?")) {
      updateUserMutation.mutate({
        id: userId,
        data: { isActive: false }
      });
    }
  };

  const handleResetPassword = (userId: string) => {
    if (window.confirm("Apakah Anda yakin ingin mereset password pengguna ini?")) {
      // TODO: Implement password reset functionality
      toast({
        title: "Info",
        description: "Fitur reset password akan segera tersedia",
      });
    }
  };

  return (
    <div>
      {/* Header with filters */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Daftar Pengguna</h3>
        <div className="flex items-center space-x-4">
          <Select value={filters.role} onValueChange={(value) => setFilters({...filters, role: value})}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Role</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="operator">Operator</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Input
              type="text"
              placeholder="Cari user..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-64 pl-10"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          </div>
        </div>
      </div>
      
      {/* User table */}
      <div className="overflow-x-auto erkas-scrollbar">
        <table className="erkas-table">
          <thead>
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">User</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Role</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Last Login</th>
              <th className="text-center px-6 py-3 font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.fullName}</p>
                      <p className="text-xs text-erkas-secondary">{user.schoolName || "No school assigned"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                <td className="px-6 py-4 text-slate-600">{formatLastLogin(user.lastLogin)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-erkas-primary"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-yellow-500"
                      title="Reset Password"
                      onClick={() => handleResetPassword(user.id)}
                    >
                      <Key size={14} />
                    </Button>
                    {user.isActive ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-red-500"
                        title="Deactivate"
                        onClick={() => handleDeactivateUser(user.id)}
                      >
                        <UserX size={14} />
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-erkas-success"
                          title="Approve"
                          onClick={() => handleActivateUser(user.id)}
                        >
                          <Check size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-red-500"
                          title="Reject"
                        >
                          <X size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-erkas-secondary">Tidak ada pengguna yang ditemukan</p>
        </div>
      )}
    </div>
  );
}
