export type SaleStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'overpaid' | 'refunded' | 'failed';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'wallet' | 'other';

export type ShiftStatus = 'open' | 'closed';

export type MovementType = 'in' | 'out' | 'adjustment' | 'transfer';

export type ExpenseCategory = 'rent' | 'utilities' | 'salaries' | 'supplies' | 'maintenance' | 'transport' | 'marketing' | 'other';

export type PurchaseStatus = 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';

export type CustomerType = 'retail' | 'wholesale';

export type ProductType = 'simple' | 'variant' | 'bundle';

export type DiscountType = 'percentage' | 'fixed_amount';

export type TaxType = 'inclusive' | 'exclusive';

export type AuditAction = 'create' | 'update' | 'delete' | 'restore' | 'login' | 'logout' | 'export';
