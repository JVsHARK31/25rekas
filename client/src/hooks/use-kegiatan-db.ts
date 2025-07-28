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
      const budget = Number(data.budget) || 0;
      const tw1Amount = data.tw1 ? Number(data.tw1) : budget * 0.25;
      const tw2Amount = data.tw2 ? Number(data.tw2) : budget * 0.25;
      const tw3Amount = data.tw3 ? Number(data.tw3) : budget * 0.25;
      const tw4Amount = data.tw4 ? Number(data.tw4) : budget * 0.25;
      
      const dbData = {
        kodeGiat: data.code || data.kodeGiat || `01.3.02.01.2.${String(Date.now()).slice(-3)}`,
        namaGiat: data.name || data.namaGiat || 'Kegiatan Baru',
        subtitle: data.description || data.subtitle || 'Deskripsi kegiatan',
        kodeDana: data.fundCode || data.kodeDana || '3.02.01',
        namaDana: data.fundName || data.namaDana || data.bidang || 'BOP Reguler',
        tw1: tw1Amount.toString(),
        tw2: tw2Amount.toString(),
        tw3: tw3Amount.toString(),
        tw4: tw4Amount.toString(),
        total: (data.total || budget || (tw1Amount + tw2Amount + tw3Amount + tw4Amount)).toString(),
        realisasi: (data.realisasi || '0').toString(),
        tanggal: data.tanggal || new Date().toISOString().split('T')[0],
        noPesanan: data.noPesanan || null,
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