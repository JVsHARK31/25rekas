// Mock data based on the exact reference implementation
export const referenceMockData = {
  bidang: [
    {
      id: "1",
      kode_bidang: "01",
      nama_bidang: "Kurikulum"
    },
    {
      id: "2", 
      kode_bidang: "02",
      nama_bidang: "Kesiswaan"
    },
    {
      id: "3",
      kode_bidang: "03", 
      nama_bidang: "Sarana dan Prasarana"
    },
    {
      id: "4",
      kode_bidang: "04",
      nama_bidang: "Pendidik dan Tenaga Kependidikan"
    },
    {
      id: "5",
      kode_bidang: "05",
      nama_bidang: "Pembiayaan"
    },
    {
      id: "6",
      kode_bidang: "06",
      nama_bidang: "Budaya dan Lingkungan Sekolah"
    },
    {
      id: "7",
      kode_bidang: "07",
      nama_bidang: "Peran Serta Masyarakat dan Kemitraan"
    },
    {
      id: "8",
      kode_bidang: "08",
      nama_bidang: "Rencana Kerja dan Evaluasi Sekolah"
    }
  ],
  
  standar: [
    {
      id: "1",
      kode_standar: "1",
      nama_standar: "Pengembangan Standar Kompetensi Lulusan"
    },
    {
      id: "2",
      kode_standar: "2", 
      nama_standar: "Pengembangan Standar Isi"
    },
    {
      id: "3",
      kode_standar: "3",
      nama_standar: "Pengembangan Standar Proses"
    },
    {
      id: "4",
      kode_standar: "4",
      nama_standar: "Pengembangan Standar Penilaian"
    },
    {
      id: "5",
      kode_standar: "5",
      nama_standar: "Pengembangan Standar Pendidik dan Tenaga Kependidikan"
    },
    {
      id: "6",
      kode_standar: "6",
      nama_standar: "Pengembangan Standar Sarana dan Prasarana"
    },
    {
      id: "7",
      kode_standar: "7",
      nama_standar: "Pengembangan Standar Pengelolaan"
    },
    {
      id: "8",
      kode_standar: "8",
      nama_standar: "Pengembangan Standar Pembiayaan"
    }
  ],
  
  dana: [
    {
      id: "1",
      kode_dana: "3.02.01",
      nama_dana: "BOP Alokasi Dasar"
    },
    {
      id: "2",
      kode_dana: "3.02.02",
      nama_dana: "BOP Kinerja"
    },
    {
      id: "3",
      kode_dana: "3.02.03",
      nama_dana: "BOS Reguler"
    },
    {
      id: "4",
      kode_dana: "3.02.04",
      nama_dana: "BOS Kinerja"
    },
    {
      id: "5",
      kode_dana: "3.02.05",
      nama_dana: "DAK Fisik"
    },
    {
      id: "6",
      kode_dana: "3.02.06",
      nama_dana: "DAK Non Fisik"
    },
    {
      id: "7",
      kode_dana: "3.02.07",
      nama_dana: "Bantuan Pemerintah Daerah"
    },
    {
      id: "8",
      kode_dana: "3.02.08",
      nama_dana: "Sumbangan Masyarakat"
    }
  ],
  
  activities: [
    {
      id: "1",
      kode_bidang: "01",
      kode_standar: "2", 
      kode_giat: "01.3.02.01.2.001",
      nama_giat: "Pengembangan Perpustakaan",
      subtitle: "Pengadaan buku dan peralatan perpustakaan untuk mendukung pembelajaran",
      kode_dana: "3.02.01",
      bidang_id: "1",
      dana_id: "1",
      tw1: 5000000,
      tw2: 3000000,
      tw3: 2000000,
      tw4: 1000000,
      tahun: 2025,
      status: "approved"
    },
    {
      id: "2",
      kode_bidang: "01",
      kode_standar: "2",
      kode_giat: "01.3.02.01.2.002", 
      nama_giat: "Pengembangan Laboratorium",
      subtitle: "Pengadaan alat dan bahan laboratorium IPA",
      kode_dana: "3.02.01",
      bidang_id: "1",
      dana_id: "1",
      tw1: 8000000,
      tw2: 5000000,
      tw3: 3000000,
      tw4: 2000000,
      tahun: 2025,
      status: "approved"
    },
    {
      id: "3", 
      kode_bidang: "02",
      kode_standar: "1",
      kode_giat: "02.3.02.01.1.001",
      nama_giat: "Kegiatan Ekstrakurikuler",
      subtitle: "Pengembangan bakat dan minat siswa melalui kegiatan ekstrakurikuler",
      kode_dana: "3.02.03",
      bidang_id: "2",
      dana_id: "3",
      tw1: 3000000,
      tw2: 2000000,
      tw3: 2000000,
      tw4: 1000000,
      tahun: 2025,
      status: "submitted"
    },
    {
      id: "4",
      kode_bidang: "03",
      kode_standar: "6",
      kode_giat: "03.3.02.01.6.001",
      nama_giat: "Pemeliharaan Gedung",
      subtitle: "Pemeliharaan dan perbaikan gedung sekolah",
      kode_dana: "3.02.01",
      bidang_id: "3",
      dana_id: "1",
      tw1: 10000000,
      tw2: 8000000,
      tw3: 5000000,
      tw4: 7000000,
      tahun: 2025,
      status: "draft"
    },
    {
      id: "5",
      kode_bidang: "04",
      kode_standar: "5",
      kode_giat: "04.3.02.01.5.001",
      nama_giat: "Pelatihan Guru",
      subtitle: "Peningkatan kompetensi guru melalui pelatihan dan workshop",
      kode_dana: "3.02.02",
      bidang_id: "4", 
      dana_id: "2",
      tw1: 4000000,
      tw2: 3000000,
      tw3: 3000000,
      tw4: 2000000,
      tahun: 2025,
      status: "approved"
    }
  ]
};

// Calculate dashboard statistics from the reference data
export const calculateReferenceStats = () => {
  const activities = referenceMockData.activities;
  
  const total = activities.length;
  const approved = activities.filter(a => a.status === 'approved').length;
  const submitted = activities.filter(a => a.status === 'submitted').length;
  const draft = activities.filter(a => a.status === 'draft').length;
  
  const totalBudget = activities.reduce((sum, activity) => {
    return sum + activity.tw1 + activity.tw2 + activity.tw3 + activity.tw4;
  }, 0);
  
  const realizedBudget = activities
    .filter(a => a.status === 'approved')
    .reduce((sum, activity) => {
      // Simulate partial realization (60% of approved budget)
      return sum + (activity.tw1 + activity.tw2 + activity.tw3 + activity.tw4) * 0.6;
    }, 0);
  
  return {
    totalActivities: total,
    approvedActivities: approved,
    submittedActivities: submitted,
    draftActivities: draft,
    pendingActivities: submitted + draft,
    totalBudget,
    realizedBudget,
    budgetUtilization: totalBudget > 0 ? (realizedBudget / totalBudget) * 100 : 0,
    lateActivities: 0 // For demo purposes
  };
};