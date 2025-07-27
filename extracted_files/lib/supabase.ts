import { createClient } from "@supabase/supabase-js"

// Mock Supabase configuration for preview environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key"

// Mock user session management
let mockSession: any = null

// Mock data storage
const STORAGE_KEYS = {
  BIDANG: "mock_rkas_bidang",
  STANDAR: "mock_rkas_standar",
  DANA: "mock_rkas_dana",
  REKENING: "mock_rkas_rekening",
  KOMPONEN: "mock_rkas_komponen",
  ACTIVITIES: "mock_rkas_activities",
  RINCIAN: "mock_rkas_rincian",
}

// Helper functions for localStorage operations
const getStoredData = (key: string) => {
  try {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error getting stored data for ${key}:`, error)
    return []
  }
}

const setStoredData = (key: string, data: any[]) => {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error storing data for ${key}:`, error)
  }
}

// Initialize mock data in localStorage
const initializeMockData = () => {
  if (typeof window === "undefined") return

  // Initialize bidang data
  if (!localStorage.getItem(STORAGE_KEYS.BIDANG)) {
    const initialBidang = [
      {
        kode_bidang: "01",
        nama_bidang: "Kurikulum",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_bidang: "02",
        nama_bidang: "Kesiswaan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_bidang: "03",
        nama_bidang: "Sarana dan Prasarana",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_bidang: "04",
        nama_bidang: "Pendidik dan Tenaga Kependidikan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_bidang: "05",
        nama_bidang: "Pembiayaan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_bidang: "06",
        nama_bidang: "Budaya dan Lingkungan Sekolah",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_bidang: "07",
        nama_bidang: "Peran Serta Masyarakat dan Kemitraan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_bidang: "08",
        nama_bidang: "Rencana Kerja dan Evaluasi Sekolah",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.BIDANG, JSON.stringify(initialBidang))
  }

  // Initialize standar data
  if (!localStorage.getItem(STORAGE_KEYS.STANDAR)) {
    const initialStandar = [
      {
        kode_standar: "1",
        nama_standar: "Pengembangan Standar Kompetensi Lulusan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_standar: "2",
        nama_standar: "Pengembangan Standar Isi",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_standar: "3",
        nama_standar: "Pengembangan Standar Proses",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_standar: "4",
        nama_standar: "Pengembangan Standar Penilaian",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_standar: "5",
        nama_standar: "Pengembangan Standar Pendidik dan Tenaga Kependidikan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_standar: "6",
        nama_standar: "Pengembangan Standar Sarana dan Prasarana",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_standar: "7",
        nama_standar: "Pengembangan Standar Pengelolaan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_standar: "8",
        nama_standar: "Pengembangan Standar Pembiayaan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.STANDAR, JSON.stringify(initialStandar))
  }

  // Initialize dana data
  if (!localStorage.getItem(STORAGE_KEYS.DANA)) {
    const initialDana = [
      {
        kode_dana: "3.02.01",
        nama_dana: "BOP Alokasi Dasar",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_dana: "3.02.02",
        nama_dana: "BOP Kinerja",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_dana: "3.01.01",
        nama_dana: "BOS Pusat",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_dana: "3.02.04",
        nama_dana: "BOS Kinerja",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_dana: "3.02.05",
        nama_dana: "DAK Fisik",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_dana: "3.02.06",
        nama_dana: "DAK Non Fisik",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_dana: "3.02.07",
        nama_dana: "Bantuan Pemerintah Daerah",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_dana: "3.02.08",
        nama_dana: "Sumbangan Masyarakat",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.DANA, JSON.stringify(initialDana))
  }

  // Initialize rekening data
  if (!localStorage.getItem(STORAGE_KEYS.REKENING)) {
    const initialRekening = [
      {
        kode_rekening: "5.1.02.01.01.0012",
        nama_rekening: "Belanja Bahan-Bahan Lainnya",
        kategori: "Belanja Barang",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_rekening: "5.1.02.01.01.0026",
        nama_rekening: "Belanja Alat/Bahan untuk Kegiatan Kantor- Bahan Cetak",
        kategori: "Belanja Barang",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_rekening: "5.1.02.01.01.0015",
        nama_rekening: "Belanja Peralatan Kebersihan dan Bahan Pembersih",
        kategori: "Belanja Barang",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_rekening: "5.1.02.01.01.0018",
        nama_rekening: "Belanja Bahan Logistik Rumah Tangga",
        kategori: "Belanja Barang",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_rekening: "5.1.02.02.01.0001",
        nama_rekening: "Belanja Bahan/Material",
        kategori: "Belanja Modal",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_rekening: "5.1.02.03.01.0001",
        nama_rekening: "Belanja Jasa Profesi",
        kategori: "Belanja Jasa",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.REKENING, JSON.stringify(initialRekening))
  }

  // Initialize komponen data
  if (!localStorage.getItem(STORAGE_KEYS.KOMPONEN)) {
    const initialKomponen = [
      {
        kode_komponen: "1.1.12.01.03.0009.00032",
        nama_komponen: "Kaos",
        satuan: "Buah",
        kategori: "Pakaian",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_komponen: "1.3.02.05.02.0005.00066",
        nama_komponen: "Kain Bludru",
        satuan: "Roll",
        kategori: "Bahan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_komponen: "1.3.02.05.02.0005.02404",
        nama_komponen: "Pin",
        satuan: "Buah",
        kategori: "Aksesoris",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_komponen: "8.1.02.02.01.0063.00908",
        nama_komponen: "Cetak Buku",
        satuan: "Buku",
        kategori: "Percetakan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        kode_komponen: "1.3.02.01.03.0005.00029",
        nama_komponen: "Pompa Bola",
        satuan: "Buah",
        kategori: "Olahraga",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.KOMPONEN, JSON.stringify(initialKomponen))
  }

  // Initialize activities data
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    const initialActivities = [
      {
        id: "535613",
        id_giat: "535613",
        kode_bidang: "01",
        kode_standar: "2",
        kode_giat: "01.3.02.01.2.001",
        nama_giat: "02.02. Pengembangan Perpustakaan",
        subtitle: "02.02.01. Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik",
        kode_dana: "3.02.01",
        tw1: 5000000,
        tw2: 3000000,
        tw3: 2000000,
        tw4: 1000000,
        januari: 0,
        februari: 0,
        maret: 0,
        april: 0,
        mei: 0,
        juni: 0,
        juli: 0,
        agustus: 0,
        september: 0,
        oktober: 0,
        november: 0,
        desember: 0,
        tahun: 2025,
        status: "approved",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "523718",
        id_giat: "523718",
        kode_bidang: "02",
        kode_standar: "3",
        kode_giat: "02.3.01.01.3.002",
        nama_giat: "03.03. Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler",
        subtitle: "03.03.07. Pelaksanaan Kegiatan Ekstrakurikuler (diluar Kepramukaan)",
        kode_dana: "3.01.01",
        tw1: 3000000,
        tw2: 2000000,
        tw3: 2000000,
        tw4: 1000000,
        januari: 0,
        februari: 0,
        maret: 0,
        april: 0,
        mei: 0,
        juni: 0,
        juli: 0,
        agustus: 0,
        september: 0,
        oktober: 0,
        november: 0,
        desember: 0,
        tahun: 2025,
        status: "submitted",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities))
  }

  // Initialize rincian data
  if (!localStorage.getItem(STORAGE_KEYS.RINCIAN)) {
    const initialRincian = [
      {
        id: "rincian-1",
        rkas_activity_id: "535613",
        kode_rekening: "5.1.02.01.01.0012",
        kode_komponen: "1.1.12.01.03.0009.00032",
        uraian: "Pembelian kaos untuk kegiatan perpustakaan",
        spesifikasi: "Kaos cotton combed 30s, ukuran S-XL",
        volume: 50,
        satuan: "Buah",
        harga_satuan: 75000,
        jumlah: 3750000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "rincian-2",
        rkas_activity_id: "523718",
        kode_rekening: "5.1.02.01.01.0026",
        kode_komponen: "8.1.02.02.01.0063.00908",
        uraian: "Cetak buku panduan ekstrakurikuler",
        spesifikasi: "Buku A4, 100 halaman, full color",
        volume: 100,
        satuan: "Buku",
        harga_satuan: 25000,
        jumlah: 2500000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.RINCIAN, JSON.stringify(initialRincian))
  }
}

// Helper function to get table data from localStorage
const getTableData = (table: string) => {
  switch (table) {
    case "rkas_bidang":
      return getStoredData(STORAGE_KEYS.BIDANG)
    case "rkas_standar":
      return getStoredData(STORAGE_KEYS.STANDAR)
    case "rkas_dana":
      return getStoredData(STORAGE_KEYS.DANA)
    case "rkas_rekening":
      return getStoredData(STORAGE_KEYS.REKENING)
    case "rkas_komponen":
      return getStoredData(STORAGE_KEYS.KOMPONEN)
    case "rkas_activities":
      return getStoredData(STORAGE_KEYS.ACTIVITIES)
    case "rkas_rincian":
      return getStoredData(STORAGE_KEYS.RINCIAN)
    default:
      return []
  }
}

// Helper function to set table data to localStorage
const setTableData = (table: string, data: any[]) => {
  switch (table) {
    case "rkas_bidang":
      setStoredData(STORAGE_KEYS.BIDANG, data)
      break
    case "rkas_standar":
      setStoredData(STORAGE_KEYS.STANDAR, data)
      break
    case "rkas_dana":
      setStoredData(STORAGE_KEYS.DANA, data)
      break
    case "rkas_rekening":
      setStoredData(STORAGE_KEYS.REKENING, data)
      break
    case "rkas_komponen":
      setStoredData(STORAGE_KEYS.KOMPONEN, data)
      break
    case "rkas_activities":
      setStoredData(STORAGE_KEYS.ACTIVITIES, data)
      break
    case "rkas_rincian":
      setStoredData(STORAGE_KEYS.RINCIAN, data)
      break
  }
}

// Helper function to get primary key for each table
const getPrimaryKey = (table: string) => {
  switch (table) {
    case "rkas_bidang":
      return "kode_bidang"
    case "rkas_standar":
      return "kode_standar"
    case "rkas_dana":
      return "kode_dana"
    case "rkas_rekening":
      return "kode_rekening"
    case "rkas_komponen":
      return "kode_komponen"
    case "rkas_activities":
      return "id"
    case "rkas_rincian":
      return "id"
    default:
      return "id"
  }
}

// Mock data generator with enhanced queries
async function mockQuery(table: string, limit?: number) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  let mockData = getTableData(table)

  // Add related data for activities
  if (table === "rkas_activities") {
    const bidangData = getStoredData(STORAGE_KEYS.BIDANG)
    const standarData = getStoredData(STORAGE_KEYS.STANDAR)
    const danaData = getStoredData(STORAGE_KEYS.DANA)

    mockData = mockData.map((activity: any) => {
      const bidang = bidangData.find((b: any) => b.kode_bidang === activity.kode_bidang)
      const standar = standarData.find((s: any) => s.kode_standar === activity.kode_standar)
      const dana = danaData.find((d: any) => d.kode_dana === activity.kode_dana)

      return {
        ...activity,
        rkas_bidang: bidang,
        rkas_standar: standar,
        rkas_dana: dana,
      }
    })
  }

  // Add related data for rincian
  if (table === "rkas_rincian") {
    const rekeningData = getStoredData(STORAGE_KEYS.REKENING)
    const komponenData = getStoredData(STORAGE_KEYS.KOMPONEN)
    const activitiesData = getStoredData(STORAGE_KEYS.ACTIVITIES)

    mockData = mockData.map((rincian: any) => {
      const rekening = rekeningData.find((r: any) => r.kode_rekening === rincian.kode_rekening)
      const komponen = komponenData.find((k: any) => k.kode_komponen === rincian.kode_komponen)
      const activity = activitiesData.find((a: any) => a.id === rincian.rkas_activity_id)

      return {
        ...rincian,
        rkas_rekening: rekening,
        rkas_komponen: komponen,
        rkas_activity: activity,
      }
    })
  }

  const data = limit ? mockData.slice(0, limit) : mockData

  return {
    data,
    error: null,
    count: mockData.length,
  }
}

// Mock Supabase client for preview environment
function createMockSupabaseClient() {
  const mockUser = {
    id: "mock-user-id",
    email: "admin@rkas.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const mockProfile = {
    id: "mock-user-id",
    full_name: "Administrator SMPN 25 Jakarta",
    role: "super_admin",
    school_id: "smpn-25-jakarta",
    school_name: "SMPN 25 Jakarta",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Initialize mock data on client creation
  if (typeof window !== "undefined") {
    initializeMockData()
  }

  // Auth state change listeners
  const authListeners: Array<(event: string, session: any) => void> = []

  return {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        // Simulate authentication delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (email === "admin@rkas.com" && password === "123456") {
          // Create mock session
          mockSession = {
            user: mockUser,
            access_token: "mock-access-token",
            refresh_token: "mock-refresh-token",
            expires_at: Date.now() + 3600000, // 1 hour from now
          }

          // Store mock session in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("mock-session", JSON.stringify(mockSession))
          }

          // Notify auth listeners
          authListeners.forEach((callback) => {
            callback("SIGNED_IN", mockSession)
          })

          return { data: { user: mockUser, session: mockSession }, error: null }
        }
        return { data: { user: null, session: null }, error: { message: "Email atau password salah" } }
      },

      signOut: async () => {
        mockSession = null
        if (typeof window !== "undefined") {
          localStorage.removeItem("mock-session")
        }

        // Notify auth listeners
        authListeners.forEach((callback) => {
          callback("SIGNED_OUT", null)
        })

        return { error: null }
      },

      getUser: async () => {
        // Check localStorage first
        if (typeof window !== "undefined") {
          const storedSession = localStorage.getItem("mock-session")
          if (storedSession) {
            try {
              const session = JSON.parse(storedSession)
              if (session.expires_at > Date.now()) {
                mockSession = session
                return { data: { user: session.user }, error: null }
              } else {
                // Session expired
                localStorage.removeItem("mock-session")
                mockSession = null
              }
            } catch (e) {
              localStorage.removeItem("mock-session")
            }
          }
        }

        return { data: { user: null }, error: null }
      },

      getSession: async () => {
        if (typeof window !== "undefined") {
          const storedSession = localStorage.getItem("mock-session")
          if (storedSession) {
            try {
              const session = JSON.parse(storedSession)
              if (session.expires_at > Date.now()) {
                return { data: { session }, error: null }
              } else {
                localStorage.removeItem("mock-session")
              }
            } catch (e) {
              localStorage.removeItem("mock-session")
            }
          }
        }
        return { data: { session: null }, error: null }
      },

      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        authListeners.push(callback)

        // Check current session and notify immediately
        if (typeof window !== "undefined") {
          const storedSession = localStorage.getItem("mock-session")
          if (storedSession) {
            try {
              const session = JSON.parse(storedSession)
              if (session.expires_at > Date.now()) {
                setTimeout(() => callback("SIGNED_IN", session), 0)
              }
            } catch (e) {
              // Invalid session
            }
          }
        }

        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const index = authListeners.indexOf(callback)
                if (index > -1) {
                  authListeners.splice(index, 1)
                }
              },
            },
          },
        }
      },
    },

    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            await new Promise((resolve) => setTimeout(resolve, 200))
            if (table === "profiles") {
              return { data: mockProfile, error: null }
            }

            // Handle single record selection for other tables
            const data = getTableData(table)
            const record = data.find((item: any) => item[column] === value)

            if (record && table === "rkas_activities") {
              // Add related data for activities
              const bidangData = getStoredData(STORAGE_KEYS.BIDANG)
              const standarData = getStoredData(STORAGE_KEYS.STANDAR)
              const danaData = getStoredData(STORAGE_KEYS.DANA)

              const bidang = bidangData.find((b: any) => b.kode_bidang === record.kode_bidang)
              const standar = standarData.find((s: any) => s.kode_standar === record.kode_standar)
              const dana = danaData.find((d: any) => d.kode_dana === record.kode_dana)

              return {
                data: {
                  ...record,
                  rkas_bidang: bidang,
                  rkas_standar: standar,
                  rkas_dana: dana,
                },
                error: null,
              }
            }

            if (record && table === "rkas_rincian") {
              // Add related data for rincian
              const rekeningData = getStoredData(STORAGE_KEYS.REKENING)
              const komponenData = getStoredData(STORAGE_KEYS.KOMPONEN)
              const activitiesData = getStoredData(STORAGE_KEYS.ACTIVITIES)

              const rekening = rekeningData.find((r: any) => r.kode_rekening === record.kode_rekening)
              const komponen = komponenData.find((k: any) => k.kode_komponen === record.kode_komponen)
              const activity = activitiesData.find((a: any) => a.id === record.rkas_activity_id)

              return {
                data: {
                  ...record,
                  rkas_rekening: rekening,
                  rkas_komponen: komponen,
                  rkas_activity: activity,
                },
                error: null,
              }
            }

            return { data: record || null, error: null }
          },
          order: (column: string, options?: any) => ({
            limit: (count: number) => mockQuery(table, count),
          }),
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => mockQuery(table, count),
        }),
        limit: (count: number) => mockQuery(table, count),
        in: (column: string, values: any[]) => ({
          then: async () => {
            const data = getTableData(table)
            const filtered = data.filter((item: any) => values.includes(item[column]))
            return { data: filtered, error: null, count: filtered.length }
          },
        }),
      }),

      insert: (data: any) => ({
        select: (columns?: string) => ({
          then: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            const newItems = Array.isArray(data) ? data : [data]
            const currentData = getTableData(table)

            const insertedItems = newItems.map((item: any) => {
              const newItem = {
                ...item,
                id: item.id || `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }

              // Check for duplicates based on primary key
              const primaryKey = getPrimaryKey(table)
              if (primaryKey && currentData.some((existing: any) => existing[primaryKey] === newItem[primaryKey])) {
                throw { code: "23505", message: "Duplicate key value" }
              }

              return newItem
            })

            // Add to stored data
            const updatedData = [...currentData, ...insertedItems]
            setTableData(table, updatedData)

            return { data: insertedItems, error: null }
          },
        }),
      }),

      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns?: string) => ({
            then: async () => {
              await new Promise((resolve) => setTimeout(resolve, 500))
              const currentData = getTableData(table)
              const updatedData = currentData.map((item: any) => {
                if (item[column] === value) {
                  return { ...item, ...data, updated_at: new Date().toISOString() }
                }
                return item
              })

              setTableData(table, updatedData)
              const updatedItems = updatedData.filter((item: any) => item[column] === value)
              return { data: updatedItems, error: null }
            },
          }),
        }),
      }),

      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            const currentData = getTableData(table)
            const filteredData = currentData.filter((item: any) => item[column] !== value)
            setTableData(table, filteredData)
            return { data: [], error: null }
          },
        }),
      }),
    }),

    storage: {
      from: (bucket: string) => ({
        download: async (path: string) => {
          return { data: new Blob(), error: null }
        },
        upload: async (path: string, file: File) => {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return {
            data: { path: `mock/${path}` },
            error: null,
          }
        },
      }),
    },
  }
}

// Create a mock client if no real configuration is provided
const isMockEnvironment = supabaseUrl.includes("mock-project") || supabaseAnonKey === "mock-anon-key"

export const supabase = isMockEnvironment ? createMockSupabaseClient() : createClient(supabaseUrl, supabaseAnonKey)
