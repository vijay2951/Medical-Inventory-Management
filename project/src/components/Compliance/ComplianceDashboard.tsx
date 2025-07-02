import React, { useState, useMemo } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Calendar, Package, Users } from 'lucide-react';
import { mockProducts, mockSuppliers } from '../../data/mockData';

const ComplianceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Memoized calculations for better performance
  const complianceData = useMemo(() => {
    const expiringProducts = mockProducts.filter(product => {
      const today = new Date();
      const expiry = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return daysUntilExpiry <= 30;
    });

    const expiringSoon = mockProducts.filter(product => {
      const today = new Date();
      const expiry = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return daysUntilExpiry > 30 && daysUntilExpiry <= 90;
    });

    const expiredSupplierLicenses = mockSuppliers.filter(supplier => {
      const today = new Date();
      const expiry = new Date(supplier.licenseExpiry);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return daysUntilExpiry <= 90;
    });

    const complianceStats = {
      totalProducts: mockProducts.length,
      compliantProducts: mockProducts.filter(p => {
        const today = new Date();
        const expiry = new Date(p.expiryDate);
        return expiry > today;
      }).length,
      totalSuppliers: mockSuppliers.length,
      compliantSuppliers: mockSuppliers.filter(s => {
        const today = new Date();
        const expiry = new Date(s.licenseExpiry);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysUntilExpiry > 90;
      }).length
    };

    const complianceScore = Math.round(
      ((complianceStats.compliantProducts / complianceStats.totalProducts) + 
       (complianceStats.compliantSuppliers / complianceStats.totalSuppliers)) / 2 * 100
    );

    return {
      expiringProducts,
      expiringSoon,
      expiredSupplierLicenses,
      complianceStats,
      complianceScore
    };
  }, []);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
  };

  const getProductComplianceStatus = (product: any) => {
    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
    
    if (daysUntilExpiry <= 0) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'Critical', color: 'bg-red-100 text-red-800' };
    } else if (daysUntilExpiry <= 90) {
      return { status: 'Warning', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'Compliant', color: 'bg-green-100 text-green-800' };
  };

  const getSupplierComplianceStatus = (supplier: any) => {
    const daysUntilExpiry = getDaysUntilExpiry(supplier.licenseExpiry);
    
    if (daysUntilExpiry <= 0) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'Expiring Soon', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' };
    } else if (daysUntilExpiry <= 90) {
      return { status: 'Renewal Due', color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' };
    }
    return { status: 'Valid', color: 'bg-green-100 text-green-800', bgColor: 'bg-white' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Compliance Score:</span>
              <span className={`font-bold ${
                complianceData.complianceScore >= 90 ? 'text-green-600' : 
                complianceData.complianceScore >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {complianceData.complianceScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'products', label: 'Product Compliance', icon: Package },
            { id: 'suppliers', label: 'Supplier Compliance', icon: Users },
            { id: 'audit', label: 'Audit Trail', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Compliance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliant Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {complianceData.complianceStats.compliantProducts}/{complianceData.complianceStats.totalProducts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliant Suppliers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {complianceData.complianceStats.compliantSuppliers}/{complianceData.complianceStats.totalSuppliers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{complianceData.expiringProducts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-gray-900">{complianceData.expiringSoon.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Critical: Expiring Within 30 Days</h3>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="space-y-3">
                {complianceData.expiringProducts.slice(0, 5).map((product) => {
                  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Batch: {product.batchNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-800">{daysUntilExpiry} days</p>
                        <p className="text-xs text-gray-500">{new Date(product.expiryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
                {complianceData.expiringProducts.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No critical issues found</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Warning: Expiring Within 90 Days</h3>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="space-y-3">
                {complianceData.expiringSoon.slice(0, 5).map((product) => {
                  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Batch: {product.batchNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-yellow-800">{daysUntilExpiry} days</p>
                        <p className="text-xs text-gray-500">{new Date(product.expiryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
                {complianceData.expiringSoon.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No warnings found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Compliance Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockProducts.map((product) => {
                    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
                    const complianceStatus = getProductComplianceStatus(product);

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sku}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-900">{product.batchNumber}</td>
                        <td className="px-4 py-3 text-gray-900">{new Date(product.expiryDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${complianceStatus.color}`}>
                            {complianceStatus.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-900">{daysUntilExpiry}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier License Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSuppliers.map((supplier) => {
                const daysUntilExpiry = getDaysUntilExpiry(supplier.licenseExpiry);
                const complianceStatus = getSupplierComplianceStatus(supplier);

                return (
                  <div key={supplier.id} className={`${complianceStatus.bgColor} p-4 rounded-lg border border-gray-200`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${complianceStatus.color}`}>
                        {complianceStatus.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          License expires: {new Date(supplier.licenseExpiry).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Compliance Activities</h3>
            <div className="space-y-4">
              {[
                { action: 'Product expiry check completed', user: 'System', time: '2 hours ago', type: 'system' },
                { action: 'Supplier license verification', user: 'Robert Wilson', time: '4 hours ago', type: 'manual' },
                { action: 'Batch recall initiated', user: 'Sarah Johnson', time: '1 day ago', type: 'critical' },
                { action: 'Compliance report generated', user: 'System', time: '2 days ago', type: 'report' },
                { action: 'New supplier onboarding completed', user: 'Mike Chen', time: '3 days ago', type: 'manual' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'critical' ? 'bg-red-500' :
                    activity.type === 'system' ? 'bg-blue-500' :
                    activity.type === 'report' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">by {activity.user}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceDashboard;