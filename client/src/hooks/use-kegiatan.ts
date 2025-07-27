import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface RKASActivity {
  id: string;
  name: string;
  bidang: string;
  standard: string;
  budget: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  quarter: string;
  month: number;
  year: number;
  createdAt: string;
  description: string;
  responsible: string;
}

// Local storage key
const STORAGE_KEY = 'rkas-kegiatan-data';

export function useKegiatan() {
  const [activities, setActivities] = useState<RKASActivity[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return generateInitialData();
  });

  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever activities change
  const saveToStorage = useCallback((data: RKASActivity[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, []);

  const createActivity = useCallback(async (data: Omit<RKASActivity, 'id' | 'createdAt' | 'status'>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      const newActivity: RKASActivity = {
        ...data,
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      setActivities(prev => {
        const updated = [...prev, newActivity];
        saveToStorage(updated);
        return updated;
      });

      toast({
        title: "Kegiatan berhasil ditambahkan",
        description: `${data.name} telah ditambahkan ke sistem.`,
      });
    } catch (error) {
      toast({
        title: "Gagal menambahkan kegiatan",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  const updateActivity = useCallback(async (id: string, data: Partial<RKASActivity>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      setActivities(prev => {
        const updated = prev.map(activity => 
          activity.id === id ? { ...activity, ...data } : activity
        );
        saveToStorage(updated);
        return updated;
      });

      toast({
        title: "Kegiatan berhasil diperbarui",
        description: "Data kegiatan telah disimpan.",
      });
    } catch (error) {
      toast({
        title: "Gagal memperbarui kegiatan",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  const deleteActivity = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call

      setActivities(prev => {
        const activity = prev.find(a => a.id === id);
        const updated = prev.filter(activity => activity.id !== id);
        saveToStorage(updated);
        
        if (activity) {
          toast({
            title: "Kegiatan berhasil dihapus",
            description: `${activity.name} telah dihapus dari sistem.`,
          });
        }
        
        return updated;
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus kegiatan",
        description: "Terjadi kesalahan saat menghapus data.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  const getActivityById = useCallback((id: string) => {
    return activities.find(activity => activity.id === id);
  }, [activities]);

  return {
    activities,
    loading,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivityById,
  };
}

function generateInitialData(): RKASActivity[] {
  const bidangList = [
    'Kurikulum', 'Kesiswaan', 'Sarana Prasarana', 'Pendidik & Tenaga',
    'Pembiayaan', 'Budaya Sekolah', 'Kemitraan', 'Evaluasi'
  ];
  
  const standardList = [
    'Standar Kompetensi Lulusan', 'Standar Isi', 'Standar Proses', 'Standar Penilaian',
    'Standar Pendidik dan Tenaga Kependidikan', 'Standar Sarana dan Prasarana',
    'Standar Pengelolaan', 'Standar Pembiayaan'
  ];

  const activities: RKASActivity[] = [];
  
  for (let i = 1; i <= 30; i++) {
    const bidang = bidangList[Math.floor(Math.random() * bidangList.length)];
    const standard = standardList[Math.floor(Math.random() * standardList.length)];
    const quarter = ['TW1', 'TW2', 'TW3', 'TW4'][Math.floor(Math.random() * 4)];
    const month = Math.floor(Math.random() * 12) + 1;
    const status = ['approved', 'pending', 'draft', 'rejected'][Math.floor(Math.random() * 4)] as any;
    
    activities.push({
      id: `activity-${i}`,
      name: `Kegiatan ${bidang} ${i}`,
      bidang,
      standard,
      budget: Math.floor(Math.random() * 50000000) + 5000000,
      status,
      quarter,
      month,
      year: 2025,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      description: `Deskripsi kegiatan ${bidang} untuk meningkatkan kualitas pendidikan sesuai dengan ${standard}. Kegiatan ini dirancang untuk mendukung pencapaian target sekolah.`,
      responsible: `Koordinator ${bidang}`
    });
  }
  
  return activities;
}