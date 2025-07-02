import React from 'react';
import { LogOut, User, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      admin: 'System Administrator',
      inventory_manager: 'Inventory Manager',
      pharmacist: 'Pharmacist',
      compliance_officer: 'Compliance Officer',
      executive: 'Executive'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Medical Inventory</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role || '')}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;