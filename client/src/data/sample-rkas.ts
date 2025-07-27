import { RkasField, RkasStandard, RkasActivity } from "@/types/rkas";

export const sampleFields: RkasField[] = [
  {
    id: "field-1",
    kodeBidang: "01",
    namaBidang: "KURIKULUM",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "field-2", 
    kodeBidang: "02",
    namaBidang: "KESISWAAN",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "field-3",
    kodeBidang: "03", 
    namaBidang: "SARANA & PRASARANA",
    createdAt: "2024-01-01T00:00:00Z"
  }
];

export const sampleStandards: RkasStandard[] = [
  {
    id: "standard-1",
    fieldId: "field-1",
    kodeStandar: "2",
    namaStandar: "Pengembangan Standar Isi",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "standard-2",
    fieldId: "field-1", 
    kodeStandar: "3",
    namaStandar: "Pengembangan Standar Proses",
    createdAt: "2024-01-01T00:00:00Z"
  }
];

export const sampleActivities: RkasActivity[] = [
  {
    id: "activity-1",
    standardId: "standard-1",
    kodeGiat: "01.3.02.01.2.001",
    namaGiat: "Pengembangan Perpustakaan",
    subtitle: "Pembelian buku dan peralatan perpustakaan",
    kodeDana: "3.02.01",
    namaDana: "BOP Reguler",
    tw1: "25000000",
    tw2: "30000000", 
    tw3: "20000000",
    tw4: "25000000",
    total: "100000000",
    realisasi: "0",
    status: "draft",
    createdBy: "user-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "activity-2",
    standardId: "standard-1",
    kodeGiat: "01.3.02.01.2.002", 
    namaGiat: "Pelatihan Guru Kurikulum",
    subtitle: "Workshop dan seminar pengembangan kurikulum",
    kodeDana: "3.02.02",
    namaDana: "BOS Reguler",
    tw1: "15000000",
    tw2: "0",
    tw3: "15000000", 
    tw4: "0",
    total: "30000000",
    realisasi: "0",
    status: "approved",
    createdBy: "user-1",
    createdAt: "2024-01-01T00:00:00Z", 
    updatedAt: "2024-01-01T00:00:00Z"
  }
];
