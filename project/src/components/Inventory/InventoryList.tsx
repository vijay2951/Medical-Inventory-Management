import React, { useState, useMemo } from 'react';
import { Package, Search, Filter, Plus, AlertTriangle, Calendar, Eye } from 'lucide-react';
import { mockProducts, mockSuppliers } from '../../data/mockData';
import { Product } from '../../types';

const InventoryList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Helper functions defined at the top
  const getSupplierName = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'recalled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (quantity: number, minThreshold: number) => {
    if (quantity <= 0) return { status: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (quantity <= minThreshold) return { status: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { status: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30;
  };

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, statusFilter, categoryFilter]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
    return uniqueCategories.sort();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
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
                placeholder="Search products..."
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
              <option value="expired">Expired</option>
              <option value="recalled">Recalled</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredProducts.length} products found</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.quantity, product.minThreshold);
          const expiringSoon = isExpiringSoon(product.expiryDate);
          
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {expiringSoon && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" title="Expiring Soon" />
                    )}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label="View product details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quantity</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}>
                      {product.quantity} units
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Supplier</span>
                    <span className="text-sm font-medium text-gray-900">{getSupplierName(product.supplierId)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Expiry Date</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className={`text-sm ${expiringSoon ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {new Date(product.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Unit Price</span>
                    <span className="text-sm font-medium text-gray-900">${product.unitPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      Min: {product.minThreshold} units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or add new products to get started.
          </p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                    <p className="text-gray-900">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">SKU</label>
                    <p className="text-gray-900">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Regulatory Class</label>
                    <p className="text-gray-900">{selectedProduct.regulatoryClass}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Quantity</label>
                    <p className="text-gray-900">{selectedProduct.quantity} units</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Min Threshold</label>
                    <p className="text-gray-900">{selectedProduct.minThreshold} units</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Unit Price</label>
                    <p className="text-gray-900">${selectedProduct.unitPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Batch Number</label>
                    <p className="text-gray-900">{selectedProduct.batchNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                    <p className={`text-gray-900 ${isExpiringSoon(selectedProduct.expiryDate) ? 'text-red-600 font-medium' : ''}`}>
                      {new Date(selectedProduct.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Supplier</label>
                    <p className="text-gray-900">{getSupplierName(selectedProduct.supplierId)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;