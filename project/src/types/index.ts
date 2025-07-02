export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'inventory_manager' | 'pharmacist' | 'compliance_officer' | 'executive';
  avatar?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  rating: number;
  status: 'active' | 'inactive';
  licenseExpiry: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minThreshold: number;
  expiryDate: string;
  batchNumber: string;
  supplierId: string;
  status: 'active' | 'expired' | 'recalled';
  category: string;
  unitPrice: number;
  regulatoryClass: 'class-i' | 'class-ii' | 'class-iii';
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  items: PurchaseOrderItem[];
  createdAt: string;
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Transaction {
  id: string;
  productId: string;
  quantity: number;
  transactionDate: string;
  type: 'inbound' | 'outbound';
  reference: string;
  userId: string;
  notes?: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  expiringSoon: number;
  totalValue: number;
  monthlyTransactions: number;
  activeSuppliers: number;
}