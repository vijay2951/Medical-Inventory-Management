import React, { useState } from 'react';
import { BarChart3, Download, Calendar, FileText, AlertTriangle, TrendingUp, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockProducts, mockSuppliers, monthlyData, categoryData } from '../../data/mockData';

const ReportsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const expiringProducts = mockProducts.filter(product => {
    const today = new Date();
    const expiry = new Date(product.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 90;
  });

  const lowStockProducts = mockProducts.filter(product => product.quantity <= product.minThreshold);

  const supplierPerformance = mockSuppliers.map(supplier => ({
    name: supplier.name,
    rating: supplier.rating,
    onTimeDelivery: Math.floor(Math.random() * 20) + 80, // Mock data
    orderCount: Math.floor(Math.random() * 50) + 10
  }));

  const generateReport = (type: string) => {
    // Mock report generation
    console.log(`Generating ${type} report...`);
    alert(`${type} report generated successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'suppliers', label: 'Suppliers', icon: TrendingUp },
            { id: 'compliance', label: 'Compliance', icon: AlertTriangle },
            { id: 'financial', label: 'Financial', icon: DollarSign }
          ].map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  reportType === type.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Expiring Products Report', desc: 'Products expiring in 30/60/90 days', type: 'expiring' },
          { title: 'Low Stock Alert Report', desc: 'Items below minimum threshold', type: 'low-stock' },
          { title: 'Supplier Performance', desc: 'Delivery and quality metrics', type: 'supplier' },
          { title: 'Inventory Valuation', desc: 'Current inventory value analysis', type: 'valuation' }
        ].map((report, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">{report.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
            <button
              onClick={() => generateReport(report.type)}
              className="w-full bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Movement Trends</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="transactions" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Inventory by Category</h3>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Supplier Performance Metrics</h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={supplierPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="onTimeDelivery" fill="#10B981" name="On-time Delivery %" />
            <Bar dataKey="rating" fill="#3B82F6" name="Rating (x20)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Critical Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Products Expiring Soon</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {expiringProducts.slice(0, 5).map((product) => {
              const daysUntilExpiry = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              return (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-800">{daysUntilExpiry} days</p>
                    <p className="text-xs text-gray-500">{new Date(product.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Items</h3>
            <Package className="h-5 w-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-800">{product.quantity} units</p>
                  <p className="text-xs text-gray-500">Min: {product.minThreshold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'Monthly Inventory Report', date: '2024-02-28', type: 'PDF', size: '2.3 MB' },
            { name: 'Supplier Performance Q1', date: '2024-02-25', type: 'Excel', size: '1.8 MB' },
            { name: 'Expiring Products Alert', date: '2024-02-20', type: 'PDF', size: '854 KB' },
            { name: 'Low Stock Summary', date: '2024-02-15', type: 'PDF', size: '1.2 MB' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.date} • {report.type} • {report.size}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;