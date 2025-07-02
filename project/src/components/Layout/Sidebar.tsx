import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  History, 
  BarChart3, 
  Settings,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { hasPermission } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' },
    { id: 'inventory', label: 'Inventory', icon: Package, permission: 'inventory' },
    { id: 'suppliers', label: 'Suppliers', icon: Users, permission: 'suppliers' },
    { id: 'orders', label: 'Purchase Orders', icon: ShoppingCart, permission: 'orders' },
    { id: 'transactions', label: 'Transactions', icon: History, permission: 'transactions' },
    { id: 'reports', label: 'Reports', icon: BarChart3, permission: 'reports' },
    { id: 'compliance', label: 'Compliance', icon: Shield, permission: 'compliance' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, permission: 'inventory' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'all' }
  ];

  const visibleItems = menuItems.filter(item => 
    hasPermission(item.permission) || hasPermission('all')
  );

  return (
    <div className="bg-white shadow-lg h-full w-64 fixed left-0 top-0 pt-16 border-r border-gray-200 z-40">
      <div className="p-4">
        <nav className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;