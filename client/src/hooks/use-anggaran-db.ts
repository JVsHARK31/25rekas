import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Quarter, Month } from '@/components/dashboard/period-selector';

export interface BudgetItem {
  id: string;
  activity: string;
  bidang: string;
  standard: string;
  allocatedBudget: number;
  usedBudget: number;
  remainingBudget: number;
  quarter?: Quarter;
  month?: Month;
  year: number;
  status: 'on-track' | 'over-budget' | 'under-budget';
  responsible: string;
}

export function useAnggaranDB() {
  const queryClient = useQueryClient();

  // Fetch budget items from database
  const { data: budgetItems = [], isLoading } = useQuery({
    queryKey: ['/api/budget-items'],
    queryFn: () => fetch('/api/budget-items').then(res => res.json()),
    retry: 1,
    staleTime: 30000, // 30 seconds
  });

  // Create budget item mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<BudgetItem, 'id' | 'remainingBudget' | 'status'>) => 
      fetch('/api/budget-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/budget-items'] });
      toast({
        title: "Anggaran Ditambahkan",
        description: "Anggaran baru berhasil ditambahkan ke database",
      });
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      toast({
        title: "Gagal Menambahkan",
        description: "Tidak dapat menambahkan anggaran ke database",
        variant: "destructive",
      });
    },
  });

  // Update budget item mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetItem> }) =>
      fetch(`/api/budget-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/budget-items'] });
      toast({
        title: "Anggaran Diperbarui",
        description: "Anggaran berhasil diperbarui di database",
      });
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({
        title: "Gagal Memperbarui",
        description: "Tidak dapat memperbarui anggaran di database",
        variant: "destructive",
      });
    },
  });

  // Delete budget item mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/budget-items/${id}`, {
        method: 'DELETE',
      }).then(res => res.ok ? null : res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/budget-items'] });
      toast({
        title: "Anggaran Dihapus",
        description: "Anggaran berhasil dihapus dari database",
      });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({
        title: "Gagal Menghapus",
        description: "Tidak dapat menghapus anggaran dari database",
        variant: "destructive",
      });
    },
  });

  const createBudgetItem = async (data: Omit<BudgetItem, 'id' | 'remainingBudget' | 'status'>) => {
    await createMutation.mutateAsync(data);
  };

  const updateBudgetItem = async (id: string, data: Partial<BudgetItem>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteBudgetItem = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    budgetItems: budgetItems as BudgetItem[],
    loading: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    createBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
  };
}