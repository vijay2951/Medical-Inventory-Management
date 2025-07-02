import React from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign, Activity, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import StatsCard from './StatsCard';
import { mockDashboardStats, monthlyData, categoryData } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard
          title="Total Products"
          value={mockDashboardStats.totalProducts}
          icon={Package}
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Low Stock Items"
          value={mockDashboardStats.lowStockCount}
          icon={AlertTriangle}
          trend={{ value: -15, isPositive: true }}
          color="yellow"
        />
        <StatsCard
          title="Expiring Soon"
          value={mockDashboardStats.expiringSoon}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Total Value"
          value={`$${mockDashboardStats.totalValue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Monthly Transactions"
          value={mockDashboardStats.monthlyTransactions}
          icon={Activity}
          trend={{ value: 5, isPositive: true }}
          color="purple"
        />
        <StatsCard
          title="Active Suppliers"
          value={mockDashboardStats.activeSuppliers}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Transaction Trends</h3>
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

        {/* Inventory by Category */}
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

      {/* Monthly Value Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Inventory Value</h3>
          <DollarSign className="h-5 w-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Value']} />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New product added', item: 'Surgical Masks (N95)', time: '2 hours ago', type: 'success' },
            { action: 'Low stock alert', item: 'Disposable Syringes 10ml', time: '4 hours ago', type: 'warning' },
            { action: 'Purchase order delivered', item: 'PO-2024-001', time: '1 day ago', type: 'info' },
            { action: 'Product expired', item: 'Ibuprofen 200mg Tablets', time: '2 days ago', type: 'error' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.item}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;