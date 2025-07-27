import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface BudgetItem {
  id: string;
  activity: string;
  bidang: string;
  standard: string;
  allocatedBudget: number;
  usedBudget: number;
  remainingBudget: number;
  quarter: string;
  month: number;
  year: number;
  status: 'on-track' | 'over-budget' | 'under-budget';
  responsible: string;
  lastUpdated: string;
}

// Local storage key
const STORAGE_KEY = 'rkas-anggaran-data';

export function useAnggaran() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return generateInitialData();
  });

  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever budgetItems change
  const saveToStorage = useCallback((data: BudgetItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, []);

  const calculateStatus = (allocated: number, used: number): BudgetItem['status'] => {
    const usagePercentage = (used / allocated) * 100;
    if (usagePercentage > 95) return 'over-budget';
    if (usagePercentage < 50) return 'under-budget';
    return 'on-track';
  };

  const createBudgetItem = useCallback(async (data: Omit<BudgetItem, 'id' | 'remainingBudget' | 'status' | 'lastUpdated'>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      const remainingBudget = data.allocatedBudget - data.usedBudget;
      const status = calculateStatus(data.allocatedBudget, data.usedBudget);
      
      const newBudgetItem: BudgetItem = {
        ...data,
        id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        remainingBudget,
        status,
        lastUpdated: new Date().toISOString()
      };

      setBudgetItems(prev => {
        const updated = [...prev, newBudgetItem];
        saveToStorage(updated);
        return updated;
      });

      toast({
        title: "Anggaran berhasil ditambahkan",
        description: `${data.activity} telah ditambahkan ke sistem.`,
      });
    } catch (error) {
      toast({
        title: "Gagal menambahkan anggaran",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  const updateBudgetItem = useCallback(async (id: string, data: Partial<BudgetItem>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      setBudgetItems(prev => {
        const updated = prev.map(item => {
          if (item.id === id) {
            const updatedItem = { ...item, ...data };
            // Recalculate derived fields
            if (data.allocatedBudget !== undefined || data.usedBudget !== undefined) {
              updatedItem.remainingBudget = updatedItem.allocatedBudget - updatedItem.usedBudget;
              updatedItem.status = calculateStatus(updatedItem.allocatedBudget, updatedItem.usedBudget);
            }
            updatedItem.lastUpdated = new Date().toISOString();
            return updatedItem;
          }
          return item;
        });
        saveToStorage(updated);
        return updated;
      });

      toast({
        title: "Anggaran berhasil diperbarui",
        description: "Data anggaran telah disimpan.",
      });
    } catch (error) {
      toast({
        title: "Gagal memperbarui anggaran",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  const deleteBudgetItem = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call

      setBudgetItems(prev => {
        const item = prev.find(b => b.id === id);
        const updated = prev.filter(item => item.id !== id);
        saveToStorage(updated);
        
        if (item) {
          toast({
            title: "Anggaran berhasil dihapus",
            description: `${item.activity} telah dihapus dari sistem.`,
          });
        }
        
        return updated;
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus anggaran",
        description: "Terjadi kesalahan saat menghapus data.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  const getBudgetItemById = useCallback((id: string) => {
    return budgetItems.find(item => item.id === id);
  }, [budgetItems]);

  return {
    budgetItems,
    loading,
    createBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    getBudgetItemById,
  };
}

function generateInitialData(): BudgetItem[] {
  const bidangList = [
    'Kurikulum', 'Kesiswaan', 'Sarana Prasarana', 'Pendidik & Tenaga',
    'Pembiayaan', 'Budaya Sekolah', 'Kemitraan', 'Evaluasi'
  ];
  
  const standardList = [
    'Standar Kompetensi Lulusan', 'Standar Isi', 'Standar Proses', 'Standar Penilaian',
    'Standar Pendidik dan Tenaga Kependidikan', 'Standar Sarana dan Prasarana',
    'Standar Pengelolaan', 'Standar Pembiayaan'
  ];

  const budgetItems: BudgetItem[] = [];
  
  for (let i = 1; i <= 25; i++) {
    const bidang = bidangList[Math.floor(Math.random() * bidangList.length)];
    const standard = standardList[Math.floor(Math.random() * standardList.length)];
    const quarter = ['TW1', 'TW2', 'TW3', 'TW4'][Math.floor(Math.random() * 4)];
    const month = Math.floor(Math.random() * 12) + 1;
    const allocatedBudget = Math.floor(Math.random() * 80000000) + 10000000;
    const usedBudget = Math.floor(allocatedBudget * (0.2 + Math.random() * 0.7)); // 20-90% used
    const remainingBudget = allocatedBudget - usedBudget;
    
    let status: BudgetItem['status'];
    const usagePercentage = (usedBudget / allocatedBudget) * 100;
    if (usagePercentage > 95) status = 'over-budget';
    else if (usagePercentage < 50) status = 'under-budget';
    else status = 'on-track';
    
    budgetItems.push({
      id: `budget-${i}`,
      activity: `Anggaran ${bidang} ${i}`,
      bidang,
      standard,
      allocatedBudget,
      usedBudget,
      remainingBudget,
      quarter,
      month,
      year: 2025,
      status,
      responsible: `Koordinator ${bidang}`,
      lastUpdated: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
    });
  }
  
  return budgetItems;
}