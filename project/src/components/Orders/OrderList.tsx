import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Plus, Calendar, DollarSign, Package, Eye, Truck } from 'lucide-react';
import { mockPurchaseOrders, mockSuppliers, mockProducts } from '../../data/mockData';
import { PurchaseOrder } from '../../types';

const OrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  // Helper functions defined at the top
  const getSupplierName = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Unknown';
  };

  const getProductName = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Calendar;
      case 'approved': return Package;
      case 'delivered': return Truck;
      default: return ShoppingCart;
    }
  };

  // Memoized filtered orders for better performance
  const filteredOrders = useMemo(() => {
    return mockPurchaseOrders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Order</span>
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
                placeholder="Search orders..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredOrders.length} orders found</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <StatusIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{getSupplierName(order.supplierId)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="View order details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Order Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Expected Delivery</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(order.expectedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="text-sm font-medium text-gray-900">{order.items.length} products</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-sm font-medium text-gray-900">${order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500">Items in this order:</span>
                      <div className="flex items-center space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {getProductName(item.productId)} (×{item.quantity})
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-gray-500">+{order.items.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or create a new order to get started.
          </p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Number</label>
                    <p className="text-gray-900 font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Supplier</label>
                    <p className="text-gray-900">{getSupplierName(selectedOrder.supplierId)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Date</label>
                    <p className="text-gray-900">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Expected Delivery</label>
                    <p className="text-gray-900">{new Date(selectedOrder.expectedDelivery).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="text-gray-900 text-lg font-semibold">${selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{getProductName(item.productId)}</p>
                              <p className="text-sm text-gray-500">Product ID: {item.productId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-gray-900">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;