import React from "react";
import { LayoutDashboard, PlusCircle, Bookmark, Settings, LogOut, Package, Store } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
  userRole?: import('../types').UserRole;
}

export function Sidebar({ activeTab, setActiveTab, onLogout, userRole = 'designer' }: SidebarProps) {
  const designerItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "editor", label: "Create Design", icon: PlusCircle },
    { id: "saved", label: "Saved Designs", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const adminItems = [
    { id: "admin-dashboard", label: "Admin Overview", icon: LayoutDashboard },
    { id: "admin-users", label: "Manage Users", icon: Bookmark },
    { id: "admin-projects", label: "All Projects", icon: Package },
    { id: "admin-stores", label: "Manage Stores", icon: Store },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const menuItems = userRole === 'admin' ? adminItems : designerItems;

  return (
    <div className="w-64 bg-gray-900 flex flex-col h-full text-gray-400">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
          <Package size={20} />
        </div>
        <span className="text-white font-bold text-xl tracking-tight">FurniStudio</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeTab === item.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "hover:bg-gray-800 hover:text-gray-200"
              }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium hover:bg-red-900/20 hover:text-red-400"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
