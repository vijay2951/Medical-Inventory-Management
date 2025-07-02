import React, { useState } from 'react';
import { History, Search, ArrowUpCircle, ArrowDownCircle, Calendar, User, FileText, Eye } from 'lucide-react';
import { mockTransactions, mockProducts, mockUsers } from '../../data/mockData';
import { Transaction } from '../../types';

const TransactionList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Helper functions defined before their usage
  const getProductName = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'inbound' ? ArrowDownCircle : ArrowUpCircle;
  };

  const getTransactionColor = (type: string) => {
    return type === 'inbound' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionBgColor = (type: string) => {
    return type === 'inbound' ? 'bg-green-50' : 'bg-red-50';
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const productName = getProductName(transaction.productId);
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">All inventory movements</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <History className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredTransactions.length} transactions found</span>
          </div>
        </div>
      </div>

      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <ArrowDownCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inbound</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockTransactions.filter(t => t.type === 'inbound').reduce((sum, t) => sum + t.quantity, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <ArrowUpCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Outbound</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.abs(mockTransactions.filter(t => t.type === 'outbound').reduce((sum, t) => sum + t.quantity, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <History className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Net Movement</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockTransactions.reduce((sum, t) => sum + t.quantity, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => {
          const TransactionIcon = getTransactionIcon(transaction.type);
          
          return (
            <div key={transaction.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTransactionBgColor(transaction.type)}`}>
                      <TransactionIcon className={`h-6 w-6 ${getTransactionColor(transaction.type)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{getProductName(transaction.productId)}</h3>
                      <p className="text-sm text-gray-500">Reference: {transaction.reference}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'inbound' ? '+' : ''}{transaction.quantity}
                    </span>
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Transaction Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Processed By</p>
                      <p className="text-sm font-medium text-gray-900">{getUserName(transaction.userId)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <span className={`text-sm font-medium capitalize ${getTransactionColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm font-medium text-gray-900">{Math.abs(transaction.quantity)} units</p>
                    </div>
                  </div>
                </div>

                {transaction.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {transaction.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getTransactionBgColor(selectedTransaction.type)}`}>
                    {selectedTransaction.type === 'inbound' ? (
                      <ArrowDownCircle className={`h-8 w-8 ${getTransactionColor(selectedTransaction.type)}`} />
                    ) : (
                      <ArrowUpCircle className={`h-8 w-8 ${getTransactionColor(selectedTransaction.type)}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{getProductName(selectedTransaction.productId)}</h3>
                    <p className="text-gray-600">Transaction ID: {selectedTransaction.id}</p>
                    <p className={`text-lg font-bold ${getTransactionColor(selectedTransaction.type)}`}>
                      {selectedTransaction.type === 'inbound' ? '+' : ''}{selectedTransaction.quantity} units
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Transaction Type</label>
                      <p className={`font-medium capitalize ${getTransactionColor(selectedTransaction.type)}`}>
                        {selectedTransaction.type}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Reference</label>
                      <p className="text-gray-900">{selectedTransaction.reference}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Processed By</label>
                      <p className="text-gray-900">{getUserName(selectedTransaction.userId)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Transaction Date</label>
                      <p className="text-gray-900">{new Date(selectedTransaction.transactionDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Quantity</label>
                      <p className="text-gray-900">{Math.abs(selectedTransaction.quantity)} units</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Product ID</label>
                      <p className="text-gray-900">{selectedTransaction.productId}</p>
                    </div>
                  </div>
                </div>

                {selectedTransaction.notes && (
                  <div className="pt-6 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-gray-900 mt-1">{selectedTransaction.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;