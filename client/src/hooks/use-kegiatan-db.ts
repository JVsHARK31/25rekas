import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Quarter, Month } from '@/components/dashboard/period-selector';

export interface KegiatanItem {
  id: string;
  kodeGiat?: string;
  namaGiat?: string;
  subtitle?: string;
  kodeDana?: string;
  namaDana?: string;
  tw1?: string | number;
  tw2?: string | number;
  tw3?: string | number;
  tw4?: string | number;
  total?: string | number;
  realisasi?: string | number;
  tanggal?: string;
  noPesanan?: string;
  status: 'draft' | 'approved' | 'pending' | 'rejected';
  standardId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for compatibility
  name?: string;
  description?: string;
  bidang?: string;
  standard?: string;
  budget?: number;
  quarter?: Quarter;
  month?: Month;
  year?: number;
  responsible?: string;
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
    mutationFn: (data: any) => {
      // Transform frontend data to database format
      const dbData = {
        kodeGiat: data.code || `01.3.02.01.2.${Date.now().toString().slice(-3)}`,
        namaGiat: data.name || data.namaGiat,
        subtitle: data.description || data.subtitle,
        kodeDana: data.fundCode || data.kodeDana || '3.02.01',
        namaDana: data.fundName || data.namaDana || data.bidang || 'BOP Reguler',
        tw1: data.tw1 || data.budget ? (Number(data.budget) * 0.25).toString() : '0',
        tw2: data.tw2 || data.budget ? (Number(data.budget) * 0.25).toString() : '0',
        tw3: data.tw3 || data.budget ? (Number(data.budget) * 0.25).toString() : '0',
        tw4: data.tw4 || data.budget ? (Number(data.budget) * 0.25).toString() : '0',
        total: data.total || data.budget?.toString() || '0',
        realisasi: data.realisasi || '0',
        tanggal: data.tanggal || new Date().toISOString(),
        status: data.status || 'draft',
        standardId: data.standardId || 'd36a22a2-5747-4bab-9c4c-eca7edba751b',
        createdBy: data.createdBy || 'd8e1be8f-f3cc-459f-929d-7f8a854c5f39'
      };
      
      return fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbData),
      }).then(res => res.json());
    },
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
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      // Transform frontend data to database format
      const dbData = {
        ...(data.name && { namaGiat: data.name }),
        ...(data.description && { subtitle: data.description }),
        ...(data.bidang && { namaDana: data.bidang }),
        ...(data.budget && { 
          total: data.budget.toString(),
          tw1: (Number(data.budget) * 0.25).toString(),
          tw2: (Number(data.budget) * 0.25).toString(),
          tw3: (Number(data.budget) * 0.25).toString(),
          tw4: (Number(data.budget) * 0.25).toString()
        }),
        ...data, // Include any direct database fields
        updatedAt: new Date().toISOString()
      };
      
      return fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbData),
      }).then(res => res.json());
    },
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