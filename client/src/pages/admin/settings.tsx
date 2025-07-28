import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Settings, Save, School, Database, Bell, Shield, Globe, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // School Information
    schoolName: "SMPN 25 Jakarta",
    schoolAddress: "Jl. Kebon Baru No. 25, Jakarta Selatan",
    schoolPhone: "021-5678901",
    schoolEmail: "info@smpn25jkt.sch.id",
    principalName: "Dr. Hj. Sari Wijayanti, M.Pd",
    npsn: "20104571",
    
    // System Settings
    academicYear: "2025/2026",
    budgetYear: "2025",
    defaultCurrency: "IDR",
    decimalPlaces: 0,
    autoBackup: true,
    backupInterval: "daily",
    sessionTimeout: 60,
    
    // Notification Settings
    emailNotifications: true,
    budgetAlerts: true,
    deadlineReminders: true,
    systemUpdates: false,
    
    // Security Settings
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionExpiry: 24,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    
    // Application Settings
    defaultPageSize: 25,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24",
    language: "id",
    theme: "light"
  });

  const handleSave = async (section: string) => {
    try {
      console.log(`Saving ${section} settings:`, settings);
      toast({
        title: "Pengaturan tersimpan",
        description: `Pengaturan ${section} berhasil diperbarui.`,
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
            <p className="text-gray-600 mt-1">
              Konfigurasi umum sistem eRKAS Pro
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Settings className="h-3 w-3" />
            <span>v2.1.0</span>
          </Badge>
        </div>

        <Tabs defaultValue="school" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="school" className="flex items-center space-x-2">
              <School className="h-4 w-4" />
              <span>Sekolah</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Sistem</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifikasi</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Keamanan</span>
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Aplikasi</span>
            </TabsTrigger>
          </TabsList>

          {/* School Information */}
          <TabsContent value="school">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <School className="h-5 w-5" />
                  <span>Informasi Sekolah</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">Nama Sekolah</Label>
                    <Input
                      id="schoolName"
                      value={settings.schoolName}
                      onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="npsn">NPSN</Label>
                    <Input
                      id="npsn"
                      value={settings.npsn}
                      onChange={(e) => handleInputChange('npsn', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="schoolAddress">Alamat Sekolah</Label>
                    <Input
                      id="schoolAddress"
                      value={settings.schoolAddress}
                      onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schoolPhone">Telepon</Label>
                    <Input
                      id="schoolPhone"
                      value={settings.schoolPhone}
                      onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schoolEmail">Email</Label>
                    <Input
                      id="schoolEmail"
                      type="email"
                      value={settings.schoolEmail}
                      onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="principalName">Nama Kepala Sekolah</Label>
                    <Input
                      id="principalName"
                      value={settings.principalName}
                      onChange={(e) => handleInputChange('principalName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave('sekolah')}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Pengaturan Sistem</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Tahun Ajaran</Label>
                    <Select 
                      value={settings.academicYear} 
                      onValueChange={(value) => handleInputChange('academicYear', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024/2025">2024/2025</SelectItem>
                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                        <SelectItem value="2026/2027">2026/2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budgetYear">Tahun Anggaran</Label>
                    <Select 
                      value={settings.budgetYear}
                      onValueChange={(value) => handleInputChange('budgetYear', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Mata Uang Default</Label>
                    <Select 
                      value={settings.defaultCurrency}
                      onValueChange={(value) => handleInputChange('defaultCurrency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="decimalPlaces">Tempat Desimal</Label>
                    <Select 
                      value={settings.decimalPlaces.toString()}
                      onValueChange={(value) => handleInputChange('decimalPlaces', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (Tanpa desimal)</SelectItem>
                        <SelectItem value="2">2 (xx.xx)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupInterval">Interval Backup</Label>
                    <Select 
                      value={settings.backupInterval}
                      onValueChange={(value) => handleInputChange('backupInterval', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Harian</SelectItem>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (menit)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Auto Backup</Label>
                    <p className="text-sm text-gray-500">
                      Backup otomatis database secara berkala
                    </p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleInputChange('autoBackup', checked)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave('sistem')}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Pengaturan Notifikasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Terima notifikasi melalui email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="budgetAlerts">Budget Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Peringatan ketika anggaran mendekati batas
                      </p>
                    </div>
                    <Switch
                      id="budgetAlerts"
                      checked={settings.budgetAlerts}
                      onCheckedChange={(checked) => handleInputChange('budgetAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="deadlineReminders">Deadline Reminders</Label>
                      <p className="text-sm text-gray-500">
                        Pengingat deadline kegiatan
                      </p>
                    </div>
                    <Switch
                      id="deadlineReminders"
                      checked={settings.deadlineReminders}
                      onCheckedChange={(checked) => handleInputChange('deadlineReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemUpdates">System Updates</Label>
                      <p className="text-sm text-gray-500">
                        Notifikasi update sistem
                      </p>
                    </div>
                    <Switch
                      id="systemUpdates"
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) => handleInputChange('systemUpdates', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave('notifikasi')}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Pengaturan Keamanan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Panjang Password Minimum</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Maksimal Percobaan Login</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionExpiry">Session Expiry (jam)</Label>
                    <Input
                      id="sessionExpiry"
                      type="number"
                      value={settings.sessionExpiry}
                      onChange={(e) => handleInputChange('sessionExpiry', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                      <p className="text-sm text-gray-500">
                        Password harus mengandung karakter khusus
                      </p>
                    </div>
                    <Switch
                      id="requireSpecialChars"
                      checked={settings.requireSpecialChars}
                      onCheckedChange={(checked) => handleInputChange('requireSpecialChars', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">
                        Aktifkan autentikasi dua faktor
                      </p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave('keamanan')}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Settings */}
          <TabsContent value="app">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Pengaturan Aplikasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultPageSize">Items per Page</Label>
                    <Select 
                      value={settings.defaultPageSize.toString()}
                      onValueChange={(value) => handleInputChange('defaultPageSize', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format Tanggal</Label>
                    <Select 
                      value={settings.dateFormat}
                      onValueChange={(value) => handleInputChange('dateFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Format Waktu</Label>
                    <Select 
                      value={settings.timeFormat}
                      onValueChange={(value) => handleInputChange('timeFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 Jam</SelectItem>
                        <SelectItem value="12">12 Jam (AM/PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Bahasa</Label>
                    <Select 
                      value={settings.language}
                      onValueChange={(value) => handleInputChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={settings.theme}
                      onValueChange={(value) => handleInputChange('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSave('aplikasi')}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}