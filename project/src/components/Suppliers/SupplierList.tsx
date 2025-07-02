import React, { useState, useMemo } from 'react';
import { Users, Search, Plus, Star, Mail, Phone, MapPin, Calendar, Eye } from 'lucide-react';
import { mockSuppliers } from '../../data/mockData';
import { Supplier } from '../../types';

const SupplierList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Helper functions defined at the top
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 90;
  };

  // Memoized filtered suppliers for better performance
  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.contact.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredSuppliers.length} suppliers found</span>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => {
          const licenseExpiringSoon = isLicenseExpiringSoon(supplier.licenseExpiry);
          
          return (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.contact}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedSupplier(supplier)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    aria-label="View supplier details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">{supplier.email}</span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-600">{supplier.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {renderStars(supplier.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{supplier.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">License Expiry</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className={`text-sm ${licenseExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {new Date(supplier.licenseExpiry).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {licenseExpiringSoon && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800">License expiring within 90 days</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or add new suppliers to get started.
          </p>
        </div>
      )}

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Supplier Details</h2>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedSupplier.name}</h3>
                    <p className="text-gray-600">{selectedSupplier.contact}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(selectedSupplier.rating)}
                      <span className="text-sm text-gray-600 ml-2">{selectedSupplier.rating.toFixed(1)}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedSupplier.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <p className="text-gray-900">{selectedSupplier.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSupplier.status)}`}>
                        {selectedSupplier.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">License Expiry</label>
                      <p className={`text-gray-900 ${isLicenseExpiringSoon(selectedSupplier.licenseExpiry) ? 'text-red-600 font-medium' : ''}`}>
                        {new Date(selectedSupplier.licenseExpiry).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created Date</label>
                      <p className="text-gray-900">{new Date(selectedSupplier.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Supplier Rating</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(selectedSupplier.rating)}
                        </div>
                        <span className="text-gray-900 font-medium">{selectedSupplier.rating.toFixed(1)}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">98%</p>
                      <p className="text-sm text-gray-600">On-time Delivery</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">5</p>
                      <p className="text-sm text-gray-600">Active Orders</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">12</p>
                      <p className="text-sm text-gray-600">Products Supplied</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;