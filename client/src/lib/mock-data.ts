// Mock data storage for client-side data management
// This mimics the localStorage approach from the reference implementation

const STORAGE_KEYS = {
  BIDANG: "rkas_bidang",
  STANDAR: "rkas_standar", 
  DANA: "rkas_dana",
  REKENING: "rkas_rekening",
  KOMPONEN: "rkas_komponen",
  ACTIVITIES: "rkas_activities",
  RINCIAN: "rkas_rincian",
  REALISASI: "rkas_realisasi"
};

// Helper functions for localStorage operations
const getStoredData = (key: string) => {
  try {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting stored data for ${key}:`, error);
    return [];
  }
};

const setStoredData = (key: string, data: any[]) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data for ${key}:`, error);
  }
};

// Initialize mock data
export const initializeMockData = () => {
  if (typeof window === "undefined") return;

  // Initialize bidang data
  if (!localStorage.getItem(STORAGE_KEYS.BIDANG)) {
    const initialBidang = [
      {
        id: "1",
        kode_bidang: "01",
        nama_bidang: "Kurikulum",
        deskripsi: "Bidang yang berkaitan dengan kurikulum dan pembelajaran",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        kode_bidang: "02",
        nama_bidang: "Kesiswaan",
        deskripsi: "Bidang yang berkaitan dengan kegiatan siswa",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        kode_bidang: "03",
        nama_bidang: "Sarana dan Prasarana",
        deskripsi: "Bidang yang berkaitan dengan fasilitas sekolah",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "4",
        kode_bidang: "04",
        nama_bidang: "Pendidik dan Tenaga Kependidikan",
        deskripsi: "Bidang yang berkaitan dengan SDM sekolah",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "5",
        kode_bidang: "05",
        nama_bidang: "Pembiayaan",
        deskripsi: "Bidang yang berkaitan dengan anggaran dan keuangan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    setStoredData(STORAGE_KEYS.BIDANG, initialBidang);
  }

  // Initialize standar data
  if (!localStorage.getItem(STORAGE_KEYS.STANDAR)) {
    const initialStandar = [
      {
        id: "1",
        kode_standar: "1",
        nama_standar: "Pengembangan Standar Kompetensi Lulusan",
        bidang_id: "1",
        created_at: new Date().toISOString(),
      },
      {
        id: "2", 
        kode_standar: "2",
        nama_standar: "Pengembangan Standar Isi",
        bidang_id: "1",
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        kode_standar: "3", 
        nama_standar: "Pengembangan Standar Proses",
        bidang_id: "1",
        created_at: new Date().toISOString(),
      }
    ];
    setStoredData(STORAGE_KEYS.STANDAR, initialStandar);
  }

  // Initialize dana data
  if (!localStorage.getItem(STORAGE_KEYS.DANA)) {
    const initialDana = [
      {
        id: "1",
        kode_dana: "3.02.01",
        nama_dana: "BOS Reguler",
        sumber_dana: "APBN",
        keterangan: "Bantuan Operasional Sekolah Reguler",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        kode_dana: "3.02.02", 
        nama_dana: "BOS Kinerja",
        sumber_dana: "APBN",
        keterangan: "Bantuan Operasional Sekolah Kinerja",
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        kode_dana: "3.02.03",
        nama_dana: "Dana Bantuan Provinsi",
        sumber_dana: "APBD Provinsi", 
        keterangan: "Dana bantuan dari Pemerintah Provinsi DKI Jakarta",
        created_at: new Date().toISOString(),
      }
    ];
    setStoredData(STORAGE_KEYS.DANA, initialDana);
  }

  // Initialize activities data
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    const initialActivities = [
      {
        id: "1",
        kode_giat: "01.3.02.01.2.001",
        nama_giat: "Pengembangan Perpustakaan",
        subtitle: "Pengadaan buku dan peralatan perpustakaan untuk mendukung pembelajaran",
        bidang_id: "1",
        standar_id: "1",
        dana_id: "1",
        tw1: "25000000",
        tw2: "15000000", 
        tw3: "10000000",
        tw4: "5000000",
        tahun: 2025,
        status: "approved",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        kode_giat: "02.3.02.01.1.001", 
        nama_giat: "Kegiatan Ekstrakurikuler",
        subtitle: "Pengembangan bakat dan minat siswa melalui kegiatan ekstrakurikuler",
        bidang_id: "2",
        standar_id: "2", 
        dana_id: "2",
        tw1: "15000000",
        tw2: "10000000",
        tw3: "10000000", 
        tw4: "5000000",
        tahun: 2025,
        status: "submitted",
        created_at: new Date().toISOString(),
      }
    ];
    setStoredData(STORAGE_KEYS.ACTIVITIES, initialActivities);
  }
};

// Mock API functions
export const mockAPI = {
  // Bidang operations
  getBidang: () => getStoredData(STORAGE_KEYS.BIDANG),
  addBidang: (data: any) => {
    const items = getStoredData(STORAGE_KEYS.BIDANG);
    const newItem = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    items.push(newItem);
    setStoredData(STORAGE_KEYS.BIDANG, items);
    return newItem;
  },
  updateBidang: (id: string, data: any) => {
    const items = getStoredData(STORAGE_KEYS.BIDANG);
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
      setStoredData(STORAGE_KEYS.BIDANG, items);
      return items[index];
    }
    return null;
  },
  deleteBidang: (id: string) => {
    const items = getStoredData(STORAGE_KEYS.BIDANG);
    const filtered = items.filter((item: any) => item.id !== id);
    setStoredData(STORAGE_KEYS.BIDANG, filtered);
    return true;
  },

  // Standar operations
  getStandar: () => getStoredData(STORAGE_KEYS.STANDAR),
  addStandar: (data: any) => {
    const items = getStoredData(STORAGE_KEYS.STANDAR);
    const newItem = {
      ...data,
      id: Date.now().toString(),  
      created_at: new Date().toISOString(),
    };
    items.push(newItem);
    setStoredData(STORAGE_KEYS.STANDAR, items);
    return newItem;
  },
  updateStandar: (id: string, data: any) => {
    const items = getStoredData(STORAGE_KEYS.STANDAR);
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      setStoredData(STORAGE_KEYS.STANDAR, items);
      return items[index];
    }
    return null;
  },
  deleteStandar: (id: string) => {
    const items = getStoredData(STORAGE_KEYS.STANDAR);
    const filtered = items.filter((item: any) => item.id !== id);
    setStoredData(STORAGE_KEYS.STANDAR, filtered);
    return true;
  },

  // Dana operations
  getDana: () => getStoredData(STORAGE_KEYS.DANA),
  addDana: (data: any) => {
    const items = getStoredData(STORAGE_KEYS.DANA);
    const newItem = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    items.push(newItem);
    setStoredData(STORAGE_KEYS.DANA, items);
    return newItem;
  },

  // Activities operations
  getActivities: () => getStoredData(STORAGE_KEYS.ACTIVITIES),
  addActivity: (data: any) => {
    const items = getStoredData(STORAGE_KEYS.ACTIVITIES);
    const newItem = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    items.push(newItem);
    setStoredData(STORAGE_KEYS.ACTIVITIES, items);
    return newItem;
  },
  updateActivity: (id: string, data: any) => {
    const items = getStoredData(STORAGE_KEYS.ACTIVITIES);
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
      setStoredData(STORAGE_KEYS.ACTIVITIES, items);
      return items[index];
    }
    return null;
  }
};