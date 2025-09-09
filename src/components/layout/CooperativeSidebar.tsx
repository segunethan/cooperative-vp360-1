import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  PiggyBank, 
  CreditCard, 
  DollarSign, 
  Megaphone, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CooperativeSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/cooperative",
  },
  {
    title: "Members",
    icon: Users,
    href: "/cooperative/members",
  },
  {
    title: "Contributions & Shares",
    icon: PiggyBank,
    href: "/cooperative/contributions",
  },
  {
    title: "Loans",
    icon: CreditCard,
    href: "/cooperative/loans",
  },
  {
    title: "Dividends",
    icon: DollarSign,
    href: "/cooperative/dividends",
  },
  {
    title: "Announcements",
    icon: Megaphone,
    href: "/cooperative/announcements",
  },
  {
    title: "Reports & Compliance",
    icon: FileText,
    href: "/cooperative/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/cooperative/settings",
  },
];

export const CooperativeSidebar = ({ collapsed, onToggleCollapse }: CooperativeSidebarProps) => {
  const location = useLocation();

  return (
    <div className={cn(
      "bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sidebar-foreground rounded-full flex items-center justify-center">
                <span className="text-sidebar font-bold text-sm">GP</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">GreenPole</h1>
                <p className="text-xs opacity-80">Cooperative Module</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
              <span className="text-sidebar-accent-foreground text-sm font-medium">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs opacity-80 truncate">admin@greenpole.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};