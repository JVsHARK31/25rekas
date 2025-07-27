import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Database,
  Palette,
  Globe,
  Lock,
  Save,
  RefreshCw
} from "lucide-react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { AuthService } from "@/lib/auth";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [settings, setSettings] = useState({
    schoolName: "SMPN 25 Jakarta",
    schoolAddress: "Jl. Raya Jakarta Selatan No. 123",
    budgetYear: "2024",
    defaultCurrency: "IDR",
    notificationEmail: true,
    notificationSms: false,
    autoBackup: true,
    backupFrequency: "daily",
    theme: "light",
    language: "id",
    timezone: "Asia/Jakarta"
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  // Check if user has admin privileges for some settings
  const isAdmin = AuthService.hasRole('super_admin');

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="erkas-loading h-8 w-8" />
      </div>
    );
  }

  const handleSaveSettings = () => {
    // This would typically save to the backend
    console.log('Saving settings:', settings);
    // Show success message
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-erkas-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Settings</h2>
            <p className="text-erkas-secondary">Kelola pengaturan sistem dan preferensi aplikasi</p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <SettingsIcon size={16} />
                General
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User size={16} />
                Account
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield size={16} />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell size={16} />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database size={16} />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2" size={20} />
                    School Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="schoolName">School Name</Label>
                      <Input
                        id="schoolName"
                        value={settings.schoolName}
                        onChange={(e) => handleSettingChange('schoolName', e.target.value)}
                        disabled={!isAdmin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetYear">Budget Year</Label>
                      <Select 
                        value={settings.budgetYear} 
                        onValueChange={(value) => handleSettingChange('budgetYear', value)}
                        disabled={!isAdmin}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="schoolAddress">School Address</Label>
                    <Input
                      id="schoolAddress"
                      value={settings.schoolAddress}
                      onChange={(e) => handleSettingChange('schoolAddress', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2" size={20} />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={settings.language} 
                        onValueChange={(value) => handleSettingChange('language', value)}
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
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select 
                        value={settings.defaultCurrency} 
                        onValueChange={(value) => handleSettingChange('defaultCurrency', value)}
                        disabled={!isAdmin}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={settings.timezone} 
                        onValueChange={(value) => handleSettingChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                          <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                          <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue="Administrator" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="admin@rkas.com" type="email" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Super Administrator" disabled />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button className="bg-erkas-primary text-white">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2" size={20} />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-erkas-secondary">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-erkas-secondary">Auto logout after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login Attempts</p>
                      <p className="text-sm text-erkas-secondary">Maximum failed login attempts</p>
                    </div>
                    <Select defaultValue="5">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-erkas-secondary">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={settings.notificationEmail}
                      onCheckedChange={(checked) => handleSettingChange('notificationEmail', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-erkas-secondary">Receive critical alerts via SMS</p>
                    </div>
                    <Switch 
                      checked={settings.notificationSms}
                      onCheckedChange={(checked) => handleSettingChange('notificationSms', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Budget Alerts</p>
                      <p className="text-sm text-erkas-secondary">Notify when budget thresholds are reached</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Approval Notifications</p>
                      <p className="text-sm text-erkas-secondary">Notify about pending approvals</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2" size={20} />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isAdmin && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto Backup</p>
                          <p className="text-sm text-erkas-secondary">Automatically backup database</p>
                        </div>
                        <Switch 
                          checked={settings.autoBackup}
                          onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Backup Frequency</p>
                          <p className="text-sm text-erkas-secondary">How often to backup data</p>
                        </div>
                        <Select 
                          value={settings.backupFrequency} 
                          onValueChange={(value) => handleSettingChange('backupFrequency', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">System Maintenance</p>
                          <p className="text-sm text-erkas-secondary">Perform database optimization</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="mr-2" size={16} />
                          Run Now
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {!isAdmin && (
                    <div className="text-center py-8">
                      <Shield className="mx-auto text-slate-400 mb-4" size={48} />
                      <p className="text-erkas-secondary">System settings require administrator privileges</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleSaveSettings}
              className="bg-erkas-primary text-white"
            >
              <Save className="mr-2" size={16} />
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}