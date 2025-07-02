import { User, Supplier, Product, PurchaseOrder, Transaction, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medical.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@medical.com',
    role: 'inventory_manager'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@medical.com',
    role: 'pharmacist'
  },
  {
    id: '4',
    name: 'Robert Wilson',
    email: 'robert.wilson@medical.com',
    role: 'compliance_officer'
  },
  {
    id: '5',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@medical.com',
    role: 'executive'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'MedTech Solutions',
    contact: 'John Smith',
    email: 'orders@medtech.com',
    address: '123 Medical Drive, Boston, MA',
    rating: 4.8,
    status: 'active',
    licenseExpiry: '2025-12-31',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'PharmaCorp International',
    contact: 'Lisa Anderson',
    email: 'supply@pharmacorp.com',
    address: '456 Pharma Ave, New York, NY',
    rating: 4.6,
    status: 'active',
    licenseExpiry: '2025-10-15',
    createdAt: '2023-02-20'
  },
  {
    id: '3',
    name: 'BioMed Supplies',
    contact: 'David Brown',
    email: 'contact@biomed.com',
    address: '789 Bio Street, San Francisco, CA',
    rating: 4.9,
    status: 'active',
    licenseExpiry: '2025-08-30',
    createdAt: '2023-03-10'
  },
  {
    id: '4',
    name: 'Global Medical Corp',
    contact: 'Maria Rodriguez',
    email: 'info@globalmedical.com',
    address: '321 Health Plaza, Chicago, IL',
    rating: 4.5,
    status: 'active',
    licenseExpiry: '2024-06-15',
    createdAt: '2023-04-05'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Surgical Masks (N95)',
    sku: 'SKU-001',
    quantity: 1250,
    minThreshold: 500,
    expiryDate: '2025-06-30',
    batchNumber: 'BT-2024-001',
    supplierId: '1',
    status: 'active',
    category: 'PPE',
    unitPrice: 2.50,
    regulatoryClass: 'class-ii',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Disposable Syringes 10ml',
    sku: 'SKU-002',
    quantity: 75,
    minThreshold: 100,
    expiryDate: '2024-12-15',
    batchNumber: 'BT-2024-002',
    supplierId: '2',
    status: 'active',
    category: 'Medical Devices',
    unitPrice: 0.85,
    regulatoryClass: 'class-ii',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Ibuprofen 200mg Tablets',
    sku: 'SKU-003',
    quantity: 2500,
    minThreshold: 1000,
    expiryDate: '2024-03-20',
    batchNumber: 'BT-2024-003',
    supplierId: '2',
    status: 'active',
    category: 'Pharmaceuticals',
    unitPrice: 0.12,
    regulatoryClass: 'class-i',
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'Blood Pressure Monitor',
    sku: 'SKU-004',
    quantity: 25,
    minThreshold: 10,
    expiryDate: '2026-01-15',
    batchNumber: 'BT-2024-004',
    supplierId: '3',
    status: 'active',
    category: 'Medical Equipment',
    unitPrice: 45.00,
    regulatoryClass: 'class-ii',
    createdAt: '2024-01-25'
  },
  {
    id: '5',
    name: 'Latex Gloves (Box of 100)',
    sku: 'SKU-005',
    quantity: 15,
    minThreshold: 25,
    expiryDate: '2025-09-30',
    batchNumber: 'BT-2024-005',
    supplierId: '1',
    status: 'active',
    category: 'PPE',
    unitPrice: 8.50,
    regulatoryClass: 'class-i',
    createdAt: '2024-02-01'
  },
  {
    id: '6',
    name: 'Digital Thermometer',
    sku: 'SKU-006',
    quantity: 50,
    minThreshold: 20,
    expiryDate: '2027-03-15',
    batchNumber: 'BT-2024-006',
    supplierId: '3',
    status: 'active',
    category: 'Medical Equipment',
    unitPrice: 15.75,
    regulatoryClass: 'class-ii',
    createdAt: '2024-02-05'
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-2024-001',
    supplierId: '1',
    orderDate: '2024-02-15',
    expectedDelivery: '2024-02-25',
    totalAmount: 5250.00,
    status: 'delivered',
    items: [
      { productId: '1', quantity: 2000, unitPrice: 2.50 },
      { productId: '5', quantity: 30, unitPrice: 8.50 }
    ],
    createdAt: '2024-02-15'
  },
  {
    id: '2',
    orderNumber: 'PO-2024-002',
    supplierId: '2',
    orderDate: '2024-02-20',
    expectedDelivery: '2024-03-05',
    totalAmount: 1385.00,
    status: 'pending',
    items: [
      { productId: '2', quantity: 500, unitPrice: 0.85 },
      { productId: '3', quantity: 8000, unitPrice: 0.12 }
    ],
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    orderNumber: 'PO-2024-003',
    supplierId: '3',
    orderDate: '2024-02-22',
    expectedDelivery: '2024-03-08',
    totalAmount: 1912.50,
    status: 'approved',
    items: [
      { productId: '4', quantity: 15, unitPrice: 45.00 },
      { productId: '6', quantity: 75, unitPrice: 15.75 }
    ],
    createdAt: '2024-02-22'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    productId: '1',
    quantity: 100,
    transactionDate: '2024-02-25',
    type: 'inbound',
    reference: 'PO-2024-001',
    userId: '2',
    notes: 'Delivery from MedTech Solutions'
  },
  {
    id: '2',
    productId: '1',
    quantity: -50,
    transactionDate: '2024-02-26',
    type: 'outbound',
    reference: 'REQ-001',
    userId: '3',
    notes: 'Emergency department request'
  },
  {
    id: '3',
    productId: '2',
    quantity: -25,
    transactionDate: '2024-02-27',
    type: 'outbound',
    reference: 'REQ-002',
    userId: '3',
    notes: 'ICU department request'
  },
  {
    id: '4',
    productId: '4',
    quantity: 5,
    transactionDate: '2024-02-28',
    type: 'inbound',
    reference: 'PO-2024-003',
    userId: '2',
    notes: 'New equipment delivery'
  },
  {
    id: '5',
    productId: '6',
    quantity: 25,
    transactionDate: '2024-03-01',
    type: 'inbound',
    reference: 'PO-2024-003',
    userId: '2',
    notes: 'Thermometer delivery'
  },
  {
    id: '6',
    productId: '5',
    quantity: -10,
    transactionDate: '2024-03-02',
    type: 'outbound',
    reference: 'REQ-003',
    userId: '3',
    notes: 'Surgery department request'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  lowStockCount: mockProducts.filter(p => p.quantity <= p.minThreshold).length,
  expiringSoon: mockProducts.filter(p => {
    const today = new Date();
    const expiry = new Date(p.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30;
  }).length,
  totalValue: mockProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0),
  monthlyTransactions: mockTransactions.length,
  activeSuppliers: mockSuppliers.filter(s => s.status === 'active').length
};

export const monthlyData = [
  { month: 'Jan', transactions: 45, value: 12500 },
  { month: 'Feb', transactions: 38, value: 9800 },
  { month: 'Mar', transactions: 52, value: 15200 },
  { month: 'Apr', transactions: 41, value: 11300 },
  { month: 'May', transactions: 47, value: 13600 },
  { month: 'Jun', transactions: 39, value: 10900 }
];

export const categoryData = [
  { name: 'PPE', value: 35, count: mockProducts.filter(p => p.category === 'PPE').length },
  { name: 'Pharmaceuticals', value: 25, count: mockProducts.filter(p => p.category === 'Pharmaceuticals').length },
  { name: 'Medical Devices', value: 20, count: mockProducts.filter(p => p.category === 'Medical Devices').length },
  { name: 'Medical Equipment', value: 20, count: mockProducts.filter(p => p.category === 'Medical Equipment').length }
];