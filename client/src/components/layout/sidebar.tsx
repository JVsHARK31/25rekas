import { Link, useLocation } from "wouter";
import { 
  Home, 
  Table, 
  Calculator, 
  Folder, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AuthService } from "@/lib/auth";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["super_admin", "operator", "viewer"] },
  { name: "RKAS Management", href: "/rkas", icon: Table, roles: ["super_admin", "operator", "viewer"] },
  { name: "Budget Analysis", href: "/budget", icon: Calculator, roles: ["super_admin", "operator", "viewer"] },
  { name: "File Management", href: "/files", icon: Folder, roles: ["super_admin", "operator", "viewer"] },
  { name: "Workflow", href: "/workflow", icon: CheckSquare, roles: ["super_admin", "operator"] },
  { name: "User Management", href: "/users", icon: Users, roles: ["super_admin"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["super_admin", "operator", "viewer"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["super_admin", "operator"] },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const canAccessRoute = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems
          .filter(item => canAccessRoute(item.roles))
          .map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "text-white bg-erkas-primary hover:bg-blue-700"
                      : "text-erkas-secondary hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="mr-3" size={18} />
                  {item.name}
                </Button>
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start px-4 py-3 text-sm font-medium text-erkas-secondary hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <LogOut className="mr-3" size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
