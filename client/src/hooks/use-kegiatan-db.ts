import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Quarter, Month } from '@/components/dashboard/period-selector';

export interface KegiatanItem {
  id: string;
  name: string;
  description: string;
  bidang: string;
  standard: string;
  budget: number;
  status: 'draft' | 'approved' | 'completed' | 'cancelled';
  quarter?: Quarter;
  month?: Month;
  year: number;
  responsible: string;
}

export function useKegiatanDB() {
  const queryClient = useQueryClient();

  // Fetch activities from database
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: () => fetch('/api/activities').then(res => res.json()),
    retry: 1,
    staleTime: 30000, // 30 seconds
  });

  // Create activity mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<KegiatanItem, 'id'>) => 
      fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Kegiatan Ditambahkan",
        description: "Kegiatan baru berhasil ditambahkan ke database",
      });
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      toast({
        title: "Gagal Menambahkan",
        description: "Tidak dapat menambahkan kegiatan ke database",
        variant: "destructive",
      });
    },
  });

  // Update activity mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KegiatanItem> }) =>
      fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Kegiatan Diperbarui",
        description: "Kegiatan berhasil diperbarui di database",
      });
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({
        title: "Gagal Memperbarui",
        description: "Tidak dapat memperbarui kegiatan di database",
        variant: "destructive",
      });
    },
  });

  // Delete activity mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/activities/${id}`, {
        method: 'DELETE',
      }).then(res => res.ok ? null : res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Kegiatan Dihapus",
        description: "Kegiatan berhasil dihapus dari database",
      });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({
        title: "Gagal Menghapus",
        description: "Tidak dapat menghapus kegiatan dari database",
        variant: "destructive",
      });
    },
  });

  const createKegiatan = async (data: Omit<KegiatanItem, 'id'>) => {
    await createMutation.mutateAsync(data);
  };

  const updateKegiatan = async (id: string, data: Partial<KegiatanItem>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteKegiatan = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    activities: activities as KegiatanItem[],
    loading: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    createKegiatan,
    updateKegiatan,
    deleteKegiatan,
  };
}