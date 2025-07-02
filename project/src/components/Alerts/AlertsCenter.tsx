import React, { useState, useMemo } from 'react';
import { AlertTriangle, Bell, Clock, Package, Users, CheckCircle, X, Filter } from 'lucide-react';
import { mockProducts, mockSuppliers } from '../../data/mockData';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'expiry' | 'stock' | 'supplier' | 'compliance';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  priority: 'high' | 'medium' | 'low';
}

const AlertsCenter: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  // Generate mock alerts based on actual data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    
    // Expiry alerts
    mockProducts.forEach(product => {
      const today = new Date();
      const expiry = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        alerts.push({
          id: `exp-${product.id}`,
          type: daysUntilExpiry <= 7 ? 'critical' : 'warning',
          category: 'expiry',
          title: `Product Expiring Soon: ${product.name}`,
          description: `${product.name} (Batch: ${product.batchNumber}) expires in ${daysUntilExpiry} days`,
          timestamp: new Date().toISOString(),
          acknowledged: Math.random() > 0.7,
          priority: daysUntilExpiry <= 7 ? 'high' : 'medium'
        });
      }
    });

    // Low stock alerts
    mockProducts.forEach(product => {
      if (product.quantity <= product.minThreshold) {
        alerts.push({
          id: `stock-${product.id}`,
          type: product.quantity === 0 ? 'critical' : 'warning',
          category: 'stock',
          title: `Low Stock Alert: ${product.name}`,
          description: `${product.name} has ${product.quantity} units remaining (minimum: ${product.minThreshold})`,
          timestamp: new Date().toISOString(),
          acknowledged: Math.random() > 0.8,
          priority: product.quantity === 0 ? 'high' : 'medium'
        });
      }
    });

    // Supplier license alerts
    mockSuppliers.forEach(supplier => {
      const today = new Date();
      const expiry = new Date(supplier.licenseExpiry);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if (daysUntilExpiry <= 90) {
        alerts.push({
          id: `sup-${supplier.id}`,
          type: daysUntilExpiry <= 30 ? 'critical' : 'warning',
          category: 'supplier',
          title: `Supplier License Expiring: ${supplier.name}`,
          description: `${supplier.name}'s license expires in ${daysUntilExpiry} days`,
          timestamp: new Date().toISOString(),
          acknowledged: Math.random() > 0.6,
          priority: daysUntilExpiry <= 30 ? 'high' : 'medium'
        });
      }
    });

    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());

  // Helper functions
  const getAlertIcon = (category: string) => {
    switch (category) {
      case 'expiry': return Clock;
      case 'stock': return Package;
      case 'supplier': return Users;
      case 'compliance': return AlertTriangle;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getAlertTextColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-800';
      case 'warning': return 'text-yellow-800';
      case 'info': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  };

  // Memoized filtered alerts for better performance
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const typeMatch = filterType === 'all' || alert.type === filterType;
      const acknowledgedMatch = showAcknowledged || !alert.acknowledged;
      return typeMatch && acknowledgedMatch;
    });
  }, [alerts, filterType, showAcknowledged]);

  // Memoized alert counts for better performance
  const alertCounts = useMemo(() => {
    const criticalCount = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length;
    const warningCount = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length;
    const totalUnacknowledged = alerts.filter(a => !a.acknowledged).length;
    
    return { criticalCount, warningCount, totalUnacknowledged };
  }, [alerts]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900">Alerts Center</h1>
          {alertCounts.totalUnacknowledged > 0 && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {alertCounts.totalUnacknowledged} unacknowledged
            </span>
          )}
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alertCounts.criticalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-gray-900">{alertCounts.warningCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showAcknowledged}
                onChange={(e) => setShowAcknowledged(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show acknowledged</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{filteredAlerts.length} alerts</span>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.category);
          
          return (
            <div
              key={alert.id}
              className={`rounded-xl border-2 p-6 transition-all duration-200 ${
                alert.acknowledged ? 'opacity-60' : ''
              } ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    alert.type === 'critical' ? 'bg-red-100' :
                    alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <AlertIcon className={`h-6 w-6 ${
                      alert.type === 'critical' ? 'text-red-600' :
                      alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`font-semibold ${getAlertTextColor(alert.type)}`}>
                        {alert.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.priority} priority
                      </span>
                      {alert.acknowledged && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Acknowledged
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${getAlertTextColor(alert.type)} mb-2`}>
                      {alert.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Acknowledge"
                      aria-label="Acknowledge alert"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Dismiss"
                    aria-label="Dismiss alert"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {filterType === 'all' && !showAcknowledged 
                ? "All alerts have been acknowledged or there are no current issues."
                : "No alerts match your current filters."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsCenter;