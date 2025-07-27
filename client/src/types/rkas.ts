export interface RkasField {
  id: string;
  kodeBidang: string;
  namaBidang: string;
  createdAt: string;
}

export interface RkasStandard {
  id: string;
  fieldId: string;
  kodeStandar: string;
  namaStandar: string;
  createdAt: string;
}

export interface RkasActivity {
  id: string;
  standardId: string;
  kodeGiat: string;
  namaGiat: string;
  subtitle?: string;
  kodeDana: string;
  namaDana: string;
  tw1: string;
  tw2: string;
  tw3: string;
  tw4: string;
  total: string;
  realisasi: string;
  tanggal?: string;
  noPesanan?: string;
  status: 'draft' | 'submitted' | 'review' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  activityId?: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: 'pdf' | 'docx' | 'jpg' | 'png';
  filePath: string;
  category?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'operator' | 'viewer';
  schoolName?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface DashboardStats {
  budget: {
    total: number;
    realized: number;
  };
  activities: {
    active: number;
    total: number;
  };
  revisions: {
    pending: number;
  };
  users: {
    total: number;
    active: number;
    pending: number;
  };
  files: {
    total: number;
  };
}
