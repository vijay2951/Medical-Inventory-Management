import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import InventoryList from './components/Inventory/InventoryList';
import SupplierList from './components/Suppliers/SupplierList';
import OrderList from './components/Orders/OrderList';
import TransactionList from './components/Transactions/TransactionList';
import ReportsDashboard from './components/Reports/ReportsDashboard';
import ComplianceDashboard from './components/Compliance/ComplianceDashboard';
import AlertsCenter from './components/Alerts/AlertsCenter';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryList />;
      case 'suppliers':
        return <SupplierList />;
      case 'orders':
        return <OrderList />;
      case 'transactions':
        return <TransactionList />;
      case 'reports':
        return <ReportsDashboard />;
      case 'compliance':
        return <ComplianceDashboard />;
      case 'alerts':
        return <AlertsCenter />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;