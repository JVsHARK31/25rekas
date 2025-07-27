"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import {
  Menu,
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  BarChart3,
  Database,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  BookOpen,
  Shield,
  Bell,
  User,
  Building2,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  profile: any
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Ringkasan dan statistik utama",
  },
  {
    title: "RKAS",
    icon: FileText,
    description: "Rencana Kegiatan dan Anggaran Sekolah",
    submenu: [
      { title: "Kegiatan RKAS", href: "/rkas/kegiatan", icon: BookOpen },
      { title: "Rincian Anggaran", href: "/rkas/rincian", icon: DollarSign },
      { title: "Anggaran Kas", href: "/rkas/anggaran-kas", icon: TrendingUp },
      { title: "Realisasi", href: "/rkas/realisasi", icon: Activity },
    ],
  },
  {
    title: "Master Data",
    icon: Database,
    description: "Kelola data master sistem",
    submenu: [
      { title: "Bidang Kegiatan", href: "/master/bidang", icon: Building2 },
      { title: "Standar Nasional", href: "/master/standar", icon: Shield },
      { title: "Sumber Dana", href: "/master/dana", icon: DollarSign },
      { title: "Rekening", href: "/master/rekening", icon: BarChart3 },
      { title: "Komponen", href: "/master/komponen", icon: Database },
    ],
  },
  {
    title: "Monitoring",
    icon: BarChart3,
    description: "Pantau progress dan status",
    submenu: [
      { title: "Status Kegiatan", href: "/monitoring/status", icon: Activity },
      { title: "Progress Anggaran", href: "/monitoring/progress", icon: TrendingUp },
    ],
  },
  {
    title: "Laporan",
    icon: FileText,
    description: "Generate laporan dan analisis",
    submenu: [
      { title: "Laporan RKAS", href: "/laporan/rkas", icon: FileText },
      { title: "Laporan Realisasi", href: "/laporan/realisasi", icon: BarChart3 },
      { title: "Analisis Anggaran", href: "/laporan/analisis", icon: TrendingUp },
    ],
  },
  {
    title: "Admin",
    icon: Settings,
    description: "Pengaturan sistem dan pengguna",
    submenu: [
      { title: "Manajemen User", href: "/admin/users", icon: Users },
      { title: "Pengaturan Sistem", href: "/admin/settings", icon: Settings },
      { title: "Log Aktivitas", href: "/admin/logs", icon: Activity },
    ],
  },
]

export function DashboardLayout({ children, user, profile }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Berhasil logout",
        description: "Anda telah berhasil keluar dari sistem",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal logout dari sistem",
        variant: "destructive",
      })
    }
  }

  const toggleMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title)
  }

  const isActiveMenu = (href: string) => {
    return pathname === href
  }

  const isActiveParentMenu = (submenu: any[]) => {
    return submenu.some((item) => pathname === item.href)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">SMPN 25 Jakarta</span>
            <span className="text-xs text-gray-500">Sistem Rencana Kegiatan dan Anggaran Sekolah</span>
          </div>
        </Link>
      </div>

      {/* Year Badge */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
            <Calendar className="mr-1 h-3 w-3" />
            Tahun Anggaran 2025
          </Badge>
          <Badge variant="outline" className="text-xs">
            Semester Ganjil
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 pb-4">
        {menuItems.map((item) => {
          const isActive = item.href ? isActiveMenu(item.href) : isActiveParentMenu(item.submenu || [])
          const isExpanded = expandedMenu === item.title

          return (
            <div key={item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-green-100 text-green-900" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-green-100 text-green-900" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && item.submenu && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActiveMenu(subItem.href)
                              ? "bg-green-50 text-green-800"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <subItem.icon className="mr-3 h-3 w-3" />
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 Pemprov DKI Jakarta</p>
          <p>RKAS System v2.1.0</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-white lg:flex">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-900">
                {menuItems.find((item) => item.href === pathname)?.title ||
                  menuItems
                    .find((item) => item.submenu?.some((sub) => sub.href === pathname))
                    ?.submenu?.find((sub) => sub.href === pathname)?.title ||
                  "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile?.avatar_url || "/placeholder.svg"}
                      alt={profile?.full_name || user?.email}
                    />
                    <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
