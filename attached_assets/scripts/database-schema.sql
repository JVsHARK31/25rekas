-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('super_admin', 'operator', 'viewer')),
  school_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RKAS Bidang table
CREATE TABLE IF NOT EXISTS rkas_bidang (
  kode_bidang TEXT PRIMARY KEY,
  nama_bidang TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RKAS Standar table
CREATE TABLE IF NOT EXISTS rkas_standar (
  kode_standar TEXT PRIMARY KEY,
  nama_standar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RKAS Dana table
CREATE TABLE IF NOT EXISTS rkas_dana (
  kode_dana TEXT PRIMARY KEY,
  nama_dana TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RKAS Activities table
CREATE TABLE IF NOT EXISTS rkas_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode_bidang TEXT REFERENCES rkas_bidang(kode_bidang),
  kode_standar TEXT REFERENCES rkas_standar(kode_standar),
  kode_giat TEXT NOT NULL,
  nama_giat TEXT NOT NULL,
  subtitle TEXT,
  kode_dana TEXT REFERENCES rkas_dana(kode_dana),
  tw1 DECIMAL(15,2) DEFAULT 0,
  tw2 DECIMAL(15,2) DEFAULT 0,
  tw3 DECIMAL(15,2) DEFAULT 0,
  tw4 DECIMAL(15,2) DEFAULT 0,
  realisasi DECIMAL(15,2) DEFAULT 0,
  tahun INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  tanggal DATE,
  no_pesanan TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RKAS Files table
CREATE TABLE IF NOT EXISTS rkas_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rkas_activity_id UUID REFERENCES rkas_activities(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rkas_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE rkas_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view RKAS activities" ON rkas_activities FOR SELECT USING (true);
CREATE POLICY "Users can insert RKAS activities" ON rkas_activities FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own RKAS activities" ON rkas_activities FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Admins can update all RKAS activities" ON rkas_activities FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'operator')
  )
);

CREATE POLICY "Users can view RKAS files" ON rkas_files FOR SELECT USING (true);
CREATE POLICY "Users can upload RKAS files" ON rkas_files FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Create indexes
CREATE INDEX idx_rkas_activities_kode_bidang ON rkas_activities(kode_bidang);
CREATE INDEX idx_rkas_activities_tahun ON rkas_activities(tahun);
CREATE INDEX idx_rkas_activities_status ON rkas_activities(status);
CREATE INDEX idx_rkas_activities_created_by ON rkas_activities(created_by);
CREATE INDEX idx_rkas_files_activity_id ON rkas_files(rkas_activity_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rkas_bidang_updated_at BEFORE UPDATE ON rkas_bidang FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rkas_standar_updated_at BEFORE UPDATE ON rkas_standar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rkas_dana_updated_at BEFORE UPDATE ON rkas_dana FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rkas_activities_updated_at BEFORE UPDATE ON rkas_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
