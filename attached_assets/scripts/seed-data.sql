-- Insert sample bidang data
INSERT INTO rkas_bidang (kode_bidang, nama_bidang) VALUES
('01', 'Kurikulum'),
('02', 'Kesiswaan'),
('03', 'Sarana dan Prasarana'),
('04', 'Pendidik dan Tenaga Kependidikan'),
('05', 'Pembiayaan'),
('06', 'Budaya dan Lingkungan Sekolah'),
('07', 'Peran Serta Masyarakat dan Kemitraan'),
('08', 'Rencana Kerja dan Evaluasi Sekolah')
ON CONFLICT (kode_bidang) DO NOTHING;

-- Insert sample standar data
INSERT INTO rkas_standar (kode_standar, nama_standar) VALUES
('1', 'Pengembangan Standar Kompetensi Lulusan'),
('2', 'Pengembangan Standar Isi'),
('3', 'Pengembangan Standar Proses'),
('4', 'Pengembangan Standar Penilaian'),
('5', 'Pengembangan Standar Pendidik dan Tenaga Kependidikan'),
('6', 'Pengembangan Standar Sarana dan Prasarana'),
('7', 'Pengembangan Standar Pengelolaan'),
('8', 'Pengembangan Standar Pembiayaan')
ON CONFLICT (kode_standar) DO NOTHING;

-- Insert sample dana data
INSERT INTO rkas_dana (kode_dana, nama_dana) VALUES
('3.02.01', 'BOP Alokasi Dasar'),
('3.02.02', 'BOP Kinerja'),
('3.02.03', 'BOS Reguler'),
('3.02.04', 'BOS Kinerja'),
('3.02.05', 'DAK Fisik'),
('3.02.06', 'DAK Non Fisik'),
('3.02.07', 'Bantuan Pemerintah Daerah'),
('3.02.08', 'Sumbangan Masyarakat')
ON CONFLICT (kode_dana) DO NOTHING;

-- Create default admin user profile (this will be created after user signs up)
-- The user must sign up first with email: admin@rkas.com and password: 123456
-- Then run this to update their profile:
-- UPDATE profiles SET role = 'super_admin', full_name = 'Administrator' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@rkas.com');

-- Insert sample RKAS activities for 2025
INSERT INTO rkas_activities (
  kode_bidang, kode_standar, kode_giat, nama_giat, subtitle, kode_dana,
  tw1, tw2, tw3, tw4, tahun, status, created_by
) VALUES
('01', '2', '01.3.02.01.2.001', 'Pengembangan Perpustakaan', 'Pengadaan buku dan peralatan perpustakaan untuk mendukung pembelajaran', '3.02.01', 5000000, 3000000, 2000000, 1000000, 2025, 'approved', (SELECT id FROM auth.users WHERE email = 'admin@rkas.com' LIMIT 1)),
('01', '2', '01.3.02.01.2.002', 'Pengembangan Laboratorium', 'Pengadaan alat dan bahan laboratorium IPA', '3.02.01', 8000000, 5000000, 3000000, 2000000, 2025, 'approved', (SELECT id FROM auth.users WHERE email = 'admin@rkas.com' LIMIT 1)),
('02', '1', '02.3.02.01.1.001', 'Kegiatan Ekstrakurikuler', 'Pengembangan bakat dan minat siswa melalui kegiatan ekstrakurikuler', '3.02.03', 3000000, 2000000, 2000000, 1000000, 2025, 'submitted', (SELECT id FROM auth.users WHERE email = 'admin@rkas.com' LIMIT 1)),
('03', '6', '03.3.02.01.6.001', 'Pemeliharaan Gedung', 'Pemeliharaan dan perbaikan gedung sekolah', '3.02.01', 10000000, 8000000, 5000000, 7000000, 2025, 'draft', (SELECT id FROM auth.users WHERE email = 'admin@rkas.com' LIMIT 1)),
('04', '5', '04.3.02.01.5.001', 'Pelatihan Guru', 'Peningkatan kompetensi guru melalui pelatihan dan workshop', '3.02.02', 4000000, 3000000, 3000000, 2000000, 2025, 'approved', (SELECT id FROM auth.users WHERE email = 'admin@rkas.com' LIMIT 1))
ON CONFLICT DO NOTHING;
