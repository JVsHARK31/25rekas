"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  School,
  Settings,
  User,
  Shield,
  Save,
  Bell,
  Globe,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building2,
  Calendar,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const [schoolSettings, setSchoolSettings] = useState({
    school_name: "SMPN 25 Jakarta",
    school_code: "20104593",
    npsn: "20104593",
    address: "Jl. Raya Condet No. 1, Kramat Jati, Jakarta Timur",
    phone: "(021) 8009876",
    email: "smpn25jkt@jakarta.go.id",
    principal_name: "Drs. Ahmad Suryadi, M.Pd",
    vice_principal_name: "Dra. Siti Nurhaliza, M.Pd",
    academic_year: "2025/2026",
    semester: "Ganjil",
    province: "DKI Jakarta",
    city: "Jakarta Timur",
    district: "Kramat Jati",
    village: "Batu Ampar",
  })

  const [systemSettings, setSystemSettings] = useState({
    app_name: "RKAS Pro",
    app_version: "2.1.0",
    maintenance_mode: false,
    email_notifications: true,
    sms_notifications: false,
    max_file_size: 10,
    allowed_file_types: "pdf,doc,docx,xls,xlsx,jpg,png",
    session_timeout: 30,
    max_login_attempts: 5,
  })

  const [userSettings, setUserSettings] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    theme: "light",
    language: "id",
    timezone: "Asia/Jakarta",
    email_alerts: true,
    browser_notifications: true,
    mobile_notifications: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    two_factor_enabled: false,
    login_alerts: true,
    account_status: "active",
    last_login: "",
    login_ip: "",
    browser_info: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
        return
      }

      setUser(user)

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        setProfile(profile)
        setUserSettings((prev) => ({
          ...prev,
          full_name: profile.full_name || "",
          email: user.email || "",
          phone: profile.phone || "",
          position: profile.position || "",
          department: profile.department || "",
        }))
      }

      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSaveSchoolSettings = async () => {
    setSaving(true)
    try {
      // In a real app, you would save to a school_settings table
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Berhasil",
        description: "Pengaturan sekolah berhasil disimpan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan sekolah",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSystemSettings = async () => {
    setSaving(true)
    try {
      // In a real app, you would save to a system_settings table
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Berhasil",
        description: "Pengaturan sistem berhasil disimpan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan sistem",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveUserSettings = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userSettings.full_name,
          phone: userSettings.phone,
          position: userSettings.position,
          department: userSettings.department,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Profil pengguna berhasil diperbarui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui profil pengguna",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (securitySettings.new_password !== securitySettings.confirm_password) {
      toast({
        title: "Error",
        description: "Password baru dan konfirmasi password tidak cocok",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: securitySettings.new_password,
      })

      if (error) throw error

      setSecuritySettings((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }))

      toast({
        title: "Berhasil",
        description: "Password berhasil diubah",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah password",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
          <p className="text-gray-600 mt-1">Kelola pengaturan aplikasi, sekolah, dan profil pengguna</p>
        </div>

        <Tabs defaultValue="school" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="school" className="flex items-center gap-2">
              <School className="w-4 h-4" />
              Data Sekolah
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Pengaturan Sistem
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profil User
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Keamanan
            </TabsTrigger>
          </TabsList>

          {/* School Settings Tab */}
          <TabsContent value="school">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-600" />
                  Informasi Sekolah
                </CardTitle>
                <CardDescription>Kelola informasi dasar sekolah dan data akademik</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="school_name" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Nama Sekolah
                      </Label>
                      <Input
                        id="school_name"
                        value={schoolSettings.school_name}
                        onChange={(e) => setSchoolSettings((prev) => ({ ...prev, school_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school_code">Kode Sekolah</Label>
                      <Input
                        id="school_code"
                        value={schoolSettings.school_code}
                        onChange={(e) => setSchoolSettings((prev) => ({ ...prev, school_code: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="npsn">NPSN</Label>
                      <Input
                        id="npsn"
                        value={schoolSettings.npsn}
                        onChange={(e) => setSchoolSettings((prev) => ({ ...prev, npsn: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telepon
                      </Label>
                      <Input
                        id="phone"
                        value={schoolSettings.phone}
                        onChange={(e) => setSchoolSettings((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={schoolSettings.email}
                        onChange={(e) => setSchoolSettings((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Alamat Lengkap
                      </Label>
                      <Textarea
                        id="address"
                        rows={3}
                        value={schoolSettings.address}
                        onChange={(e) => setSchoolSettings((prev) => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="principal_name">Kepala Sekolah</Label>
                      <Input
                        id="principal_name"
                        value={schoolSettings.principal_name}
                        onChange={(e) => setSchoolSettings((prev) => ({ ...prev, principal_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vice_principal_name">Wakil Kepala Sekolah</Label>
                      <Input
                        id="vice_principal_name"
                        value={schoolSettings.vice_principal_name}
                        onChange={(e) =>
                          setSchoolSettings((prev) => ({ ...prev, vice_principal_name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="academic_year" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Tahun Ajaran
                        </Label>
                        <Input
                          id="academic_year"
                          value={schoolSettings.academic_year}
                          onChange={(e) => setSchoolSettings((prev) => ({ ...prev, academic_year: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Input
                          id="semester"
                          value={schoolSettings.semester}
                          onChange={(e) => setSchoolSettings((prev) => ({ ...prev, semester: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input
                      id="province"
                      value={schoolSettings.province}
                      onChange={(e) => setSchoolSettings((prev) => ({ ...prev, province: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota/Kabupaten</Label>
                    <Input
                      id="city"
                      value={schoolSettings.city}
                      onChange={(e) => setSchoolSettings((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">Kecamatan</Label>
                    <Input
                      id="district"
                      value={schoolSettings.district}
                      onChange={(e) => setSchoolSettings((prev) => ({ ...prev, district: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village">Kelurahan</Label>
                    <Input
                      id="village"
                      value={schoolSettings.village}
                      onChange={(e) => setSchoolSettings((prev) => ({ ...prev, village: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSchoolSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <LoadingSpinner />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Pengaturan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-green-600" />
                  Pengaturan Sistem
                </CardTitle>
                <CardDescription>Konfigurasi aplikasi, notifikasi, dan keamanan sistem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informasi Aplikasi</h3>
                    <div className="space-y-2">
                      <Label htmlFor="app_name">Nama Aplikasi</Label>
                      <Input
                        id="app_name"
                        value={systemSettings.app_name}
                        onChange={(e) => setSystemSettings((prev) => ({ ...prev, app_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="app_version">Versi Aplikasi</Label>
                      <Input
                        id="app_version"
                        value={systemSettings.app_version}
                        onChange={(e) => setSystemSettings((prev) => ({ ...prev, app_version: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mode Maintenance</Label>
                        <p className="text-sm text-gray-500">Aktifkan untuk maintenance sistem</p>
                      </div>
                      <Switch
                        checked={systemSettings.maintenance_mode}
                        onCheckedChange={(checked) =>
                          setSystemSettings((prev) => ({ ...prev, maintenance_mode: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifikasi</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Kirim notifikasi via email</p>
                      </div>
                      <Switch
                        checked={systemSettings.email_notifications}
                        onCheckedChange={(checked) =>
                          setSystemSettings((prev) => ({ ...prev, email_notifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Kirim notifikasi via SMS</p>
                      </div>
                      <Switch
                        checked={systemSettings.sms_notifications}
                        onCheckedChange={(checked) =>
                          setSystemSettings((prev) => ({ ...prev, sms_notifications: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">File Upload</h3>
                    <div className="space-y-2">
                      <Label htmlFor="max_file_size">Maksimal Ukuran File (MB)</Label>
                      <Input
                        id="max_file_size"
                        type="number"
                        value={systemSettings.max_file_size}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({ ...prev, max_file_size: Number.parseInt(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowed_file_types">Tipe File yang Diizinkan</Label>
                      <Input
                        id="allowed_file_types"
                        value={systemSettings.allowed_file_types}
                        onChange={(e) => setSystemSettings((prev) => ({ ...prev, allowed_file_types: e.target.value }))}
                        placeholder="pdf,doc,docx,xls,xlsx"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Keamanan</h3>
                    <div className="space-y-2">
                      <Label htmlFor="session_timeout" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Session Timeout (menit)
                      </Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        value={systemSettings.session_timeout}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({ ...prev, session_timeout: Number.parseInt(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_login_attempts">Maksimal Percobaan Login</Label>
                      <Input
                        id="max_login_attempts"
                        type="number"
                        value={systemSettings.max_login_attempts}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            max_login_attempts: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSystemSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <LoadingSpinner />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Pengaturan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Settings Tab */}
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Profil Pengguna
                </CardTitle>
                <CardDescription>Kelola informasi profil dan preferensi pengguna</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informasi Personal</h3>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nama Lengkap</Label>
                      <Input
                        id="full_name"
                        value={userSettings.full_name}
                        onChange={(e) => setUserSettings((prev) => ({ ...prev, full_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_email">Email</Label>
                      <Input id="user_email" type="email" value={userSettings.email} disabled className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telepon
                      </Label>
                      <Input
                        id="user_phone"
                        value={userSettings.phone}
                        onChange={(e) => setUserSettings((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Jabatan</Label>
                      <Input
                        id="position"
                        value={userSettings.position}
                        onChange={(e) => setUserSettings((prev) => ({ ...prev, position: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Bagian/Departemen</Label>
                      <Input
                        id="department"
                        value={userSettings.department}
                        onChange={(e) => setUserSettings((prev) => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preferensi</h3>
                    <div className="space-y-2">
                      <Label htmlFor="theme" className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Theme
                      </Label>
                      <select
                        id="theme"
                        value={userSettings.theme}
                        onChange={(e) => setUserSettings((prev) => ({ ...prev, theme: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Bahasa
                      </Label>
                      <select
                        id="language"
                        value={userSettings.language}
                        onChange={(e) => setUserSettings((prev) => ({ ...prev, language: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="id">Bahasa Indonesia</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Timezone
                      </Label>
                      <select
                        id="timezone"
                        value={userSettings.timezone}
                        onChange={(e) => setUserSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                        <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                        <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifikasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Alerts
                        </Label>
                        <p className="text-sm text-gray-500">Terima alert via email</p>
                      </div>
                      <Switch
                        checked={userSettings.email_alerts}
                        onCheckedChange={(checked) => setUserSettings((prev) => ({ ...prev, email_alerts: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          Browser Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Notifikasi browser</p>
                      </div>
                      <Switch
                        checked={userSettings.browser_notifications}
                        onCheckedChange={(checked) =>
                          setUserSettings((prev) => ({ ...prev, browser_notifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Mobile Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Notifikasi mobile</p>
                      </div>
                      <Switch
                        checked={userSettings.mobile_notifications}
                        onCheckedChange={(checked) =>
                          setUserSettings((prev) => ({ ...prev, mobile_notifications: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveUserSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <LoadingSpinner />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Profil
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    Ubah Password
                  </CardTitle>
                  <CardDescription>Perbarui password untuk meningkatkan keamanan akun</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Password Saat Ini</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showPassword ? "text" : "password"}
                        value={securitySettings.current_password}
                        onChange={(e) => setSecuritySettings((prev) => ({ ...prev, current_password: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password">Password Baru</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={securitySettings.new_password}
                      onChange={(e) => setSecuritySettings((prev) => ({ ...prev, new_password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={securitySettings.confirm_password}
                      onChange={(e) => setSecuritySettings((prev) => ({ ...prev, confirm_password: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleChangePassword} disabled={saving}>
                    {saving ? (
                      <>
                        <LoadingSpinner />
                        Mengubah...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Ubah Password
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keamanan Akun</CardTitle>
                  <CardDescription>Status keamanan dan aktivitas login akun Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Tambahan keamanan dengan 2FA</p>
                    </div>
                    <Switch
                      checked={securitySettings.two_factor_enabled}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({ ...prev, two_factor_enabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-gray-500">Notifikasi saat ada login baru</p>
                    </div>
                    <Switch
                      checked={securitySettings.login_alerts}
                      onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, login_alerts: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Status Akun</h4>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Akun Terverifikasi</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Login Terakhir</Label>
                        <p>{new Date().toLocaleString("id-ID")}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">IP Address</Label>
                        <p>192.168.1.100</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Browser</Label>
                        <p>Chrome 120.0.0.0</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Lokasi</Label>
                        <p>Jakarta, Indonesia</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
