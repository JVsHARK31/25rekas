import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';
import { apiRequest } from '@/lib/queryClient';

export type PeriodType = 'quarterly' | 'monthly';
export type Quarter = 'TW1' | 'TW2' | 'TW3' | 'TW4';
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface UserPreferences {
  periodType: PeriodType;
  selectedQuarter?: Quarter;
  selectedMonth?: Month;
  selectedYear: number;
  lastUsedPage?: string;
}

const defaultPreferences: UserPreferences = {
  periodType: 'quarterly',
  selectedQuarter: 'TW1',
  selectedMonth: 1,
  selectedYear: 2025,
  lastUsedPage: '/rkas-kegiatan'
};

export function usePreferences() {
  const queryClient = useQueryClient();
  
  // For now, use localStorage as fallback until authentication is implemented
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('rkas-preferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  // Query for server preferences (when auth is implemented)
  const { data: serverPreferences, isLoading } = useQuery({
    queryKey: ['/api/preferences'],
    enabled: false, // Disable until authentication is implemented
    retry: false,
  });

  // Mutation to save preferences to server
  const savePreferencesMutation = useMutation({
    mutationFn: (preferences: Partial<UserPreferences>) =>
      fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
      toast({
        title: "Pengaturan Disimpan",
        description: "Preferensi filter periode berhasil disimpan",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Menyimpan",
        description: "Tidak dapat menyimpan pengaturan. Menggunakan penyimpanan lokal.",
        variant: "destructive",
      });
    },
  });

  // Use local preferences for now
  const preferences = localPreferences;

  // Save to both local storage and server
  const savePreferences = async (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    
    // Always save to localStorage
    setLocalPreferences(updated);
    localStorage.setItem('rkas-preferences', JSON.stringify(updated));
    
    // Try to save to server (will fail gracefully if not authenticated)
    try {
      await savePreferencesMutation.mutateAsync(newPreferences);
    } catch (error) {
      // Fallback to localStorage only
      console.log('Server save failed, using localStorage');
    }
  };

  const updatePeriodType = (periodType: PeriodType) => {
    savePreferences({ periodType });
  };

  const updateQuarter = (quarter: Quarter) => {
    savePreferences({ selectedQuarter: quarter, periodType: 'quarterly' });
  };

  const updateMonth = (month: Month) => {
    savePreferences({ selectedMonth: month, periodType: 'monthly' });
  };

  const updateYear = (year: number) => {
    savePreferences({ selectedYear: year });
  };

  const updateLastUsedPage = (page: string) => {
    savePreferences({ lastUsedPage: page });
  };

  return {
    preferences,
    isLoading,
    updatePeriodType,
    updateQuarter,
    updateMonth,
    updateYear,
    updateLastUsedPage,
    savePreferences,
  };
}