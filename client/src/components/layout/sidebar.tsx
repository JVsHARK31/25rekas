import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  Home, 
  Table, 
  Calculator, 
  Folder, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  Target,
  Zap,
  Database,
  Building,
  Globe,
  CreditCard,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AuthService } from "@/lib/auth";

const navigationItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: Home, 
    roles: ["super_admin", "operator", "viewer"] 
  },
  { 
    name: "RKAS", 
    icon: Table, 
    roles: ["super_admin", "operator", "viewer"],
    submenu: [
      { name: "Kegiatan RKAS", href: "/rkas-kegiatan", icon: CheckSquare },
      { name: "Rincian Anggaran", href: "/rkas-anggaran", icon: DollarSign },
      { name: "Anggaran Kas", href: "/rkas/kas", icon: CreditCard },
      { name: "Realisasi", href: "/rkas/realisasi", icon: Target }
    ]
  },
  { 
    name: "Master Data", 
    icon: Database, 
    roles: ["super_admin", "operator"],
    submenu: [
      { name: "Bidang Kegiatan", href: "/master/bidang", icon: Building },
      { name: "Standar Nasional", href: "/master/standar", icon: Globe },
      { name: "Sumber Dana", href: "/master/sumber-dana", icon: DollarSign },
      { name: "Rekening", href: "/master/rekening", icon: FileText },
      { name: "Komponen", href: "/master/komponen", icon: Box }
    ]
  },
  { 
    name: "Monitoring", 
    icon: BarChart3, 
    roles: ["super_admin", "operator", "viewer"],
    submenu: [
      { name: "Progress Anggaran", href: "/monitoring/progress", icon: Target },
      { name: "Laporan Realisasi", href: "/monitoring/realisasi", icon: FileText }
    ]
  },
  { 
    name: "Laporan", 
    icon: FileText, 
    roles: ["super_admin", "operator", "viewer"],
    submenu: [
      { name: "Laporan RKAS", href: "/laporan/rkas", icon: FileText },
      { name: "Laporan Realisasi", href: "/laporan/realisasi", icon: Target }
    ]
  },
  { 
    name: "Admin", 
    icon: Settings, 
    roles: ["super_admin"],
    submenu: [
      { name: "User Management", href: "/admin/users", icon: Users },
      { name: "System Settings", href: "/admin/settings", icon: Settings }
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['RKAS', 'Master Data']);

  const canAccessRoute = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some(item => item.href === location);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* School Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            25
          </div>
          <div>
            <h3 className="font-bold text-slate-900">SMPN 25 Jakarta</h3>
            <p className="text-xs text-slate-500">Sistem Rencana Kegiatan dan Anggaran Sekolah</p>
          </div>
        </div>
        
        {/* Year Selector */}
        <div className="mt-4">
          <div className="text-xs text-slate-500 mb-1">Tahun</div>
          <div className="text-xs text-green-600 font-medium">Anggaran 2025</div>
          <div className="text-xs text-slate-400">Semester Ganjil</div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigationItems
          .filter(item => canAccessRoute(item.roles))
          .map((item) => {
            const isExpanded = expandedItems.includes(item.name);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isActive = item.href === location || (hasSubmenu && isSubmenuActive(item.submenu));
            const Icon = item.icon;
            
            return (
              <div key={item.name}>
                {/* Main Item */}
                {item.href ? (
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "text-white bg-green-600 hover:bg-green-700"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="mr-3" size={16} />
                      {item.name}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => hasSubmenu && toggleExpanded(item.name)}
                    className={`w-full justify-start px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-white bg-green-600 hover:bg-green-700"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="mr-3" size={16} />
                    <span className="flex-1 text-left">{item.name}</span>
                    {hasSubmenu && (
                      isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </Button>
                )}

                {/* Submenu Items */}
                {hasSubmenu && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive = location === subItem.href;
                      const SubIcon = subItem.icon;
                      
                      return (
                        <Link key={subItem.name} href={subItem.href}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start px-3 py-1.5 text-xs font-normal rounded-md transition-colors ${
                              isSubActive
                                ? "text-green-700 bg-green-50 hover:bg-green-100"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            <SubIcon className="mr-2" size={14} />
                            {subItem.name}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <LogOut className="mr-3" size={16} />
          Logout
        </Button>
        
        <div className="mt-4 text-xs text-slate-400 text-center">
          © 2025 Pemprov DKI Jakarta<br />
          RKAS System v2.1.0
        </div>
      </div>
    </aside>
  );
}
