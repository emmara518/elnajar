import type { Money } from '../value-objects';

export interface DomainEvent {
  eventId: string;
  eventType: string;
  occurredAt: string;
  aggregateId: string;
  aggregateType: string;
}

// ─── Auth & Identity ──────────────────────────────────────────

export interface UserCreated extends DomainEvent {
  eventType: 'user.created';
  aggregateType: 'User';
  payload: { userId: string; email: string; name: string };
}

export interface EmployeeCreated extends DomainEvent {
  eventType: 'employee.created';
  aggregateType: 'Employee';
  payload: { employeeId: string; userId: string; roleId: string; branchId: string; employeeCode: string };
}

export interface EmployeeRoleChanged extends DomainEvent {
  eventType: 'employee.role_changed';
  aggregateType: 'Employee';
  payload: { employeeId: string; oldRoleId: string; newRoleId: string; changedBy: string };
}

// ─── Catalog ──────────────────────────────────────────────────

export interface ProductCreated extends DomainEvent {
  eventType: 'product.created';
  aggregateType: 'Product';
  payload: { productId: string; name: string; sku: string; categoryId: string };
}

export interface ProductUpdated extends DomainEvent {
  eventType: 'product.updated';
  aggregateType: 'Product';
  payload: { productId: string; changedFields: string[] };
}

export interface ProductDeleted extends DomainEvent {
  eventType: 'product.deleted';
  aggregateType: 'Product';
  payload: { productId: string; name: string };
}

export interface CategoryCreated extends DomainEvent {
  eventType: 'category.created';
  aggregateType: 'Category';
  payload: { categoryId: string; name: string; parentCategoryId?: string };
}

// ─── Inventory ────────────────────────────────────────────────

export interface InventoryAdjusted extends DomainEvent {
  eventType: 'inventory.adjusted';
  aggregateType: 'InventoryItem';
  payload: { inventoryItemId: string; productId: string; branchId: string; oldQuantity: number; newQuantity: number; reason: string };
}

export interface LowStockDetected extends DomainEvent {
  eventType: 'inventory.low_stock';
  aggregateType: 'InventoryItem';
  payload: { inventoryItemId: string; productId: string; branchId: string; currentQuantity: number; reorderPoint: number };
}

export interface StockReceived extends DomainEvent {
  eventType: 'inventory.stock_received';
  aggregateType: 'InventoryItem';
  payload: { inventoryItemId: string; purchaseItemId: string; productId: string; quantity: number };
}

// ─── Sales ────────────────────────────────────────────────────

export interface SaleCreated extends DomainEvent {
  eventType: 'sale.created';
  aggregateType: 'Sale';
  payload: { saleId: string; orderNumber: string; branchId: string; shiftId: string; customerId?: string; total: number };
}

export interface SaleConfirmed extends DomainEvent {
  eventType: 'sale.confirmed';
  aggregateType: 'Sale';
  payload: { saleId: string; orderNumber: string; total: number; paymentMethod: string };
}

export interface SaleCancelled extends DomainEvent {
  eventType: 'sale.cancelled';
  aggregateType: 'Sale';
  payload: { saleId: string; orderNumber: string; reason: string };
}

export interface SaleCompleted extends DomainEvent {
  eventType: 'sale.completed';
  aggregateType: 'Sale';
  payload: { saleId: string; orderNumber: string; grandTotal: Money };
}

// ─── Shifts ───────────────────────────────────────────────────

export interface ShiftOpened extends DomainEvent {
  eventType: 'shift.opened';
  aggregateType: 'Shift';
  payload: { shiftId: string; branchId: string; employeeId: string; openingCash: number };
}

export interface ShiftClosed extends DomainEvent {
  eventType: 'shift.closed';
  aggregateType: 'Shift';
  payload: { shiftId: string; branchId: string; employeeId: string; closingCash: number; expectedCash: number; cashDifference: number };
}

// ─── Purchasing ───────────────────────────────────────────────

export interface PurchaseOrdered extends DomainEvent {
  eventType: 'purchase.ordered';
  aggregateType: 'Purchase';
  payload: { purchaseId: string; orderNumber: string; supplierId: string; total: number };
}

export interface PurchaseReceived extends DomainEvent {
  eventType: 'purchase.received';
  aggregateType: 'Purchase';
  payload: { purchaseId: string; orderNumber: string; receivedById: string };
}

// ─── Financial ────────────────────────────────────────────────

export interface ExpenseRecorded extends DomainEvent {
  eventType: 'expense.recorded';
  aggregateType: 'Expense';
  payload: { expenseId: string; branchId: string; amount: number; category: string; description: string };
}

export interface PaymentVerified extends DomainEvent {
  eventType: 'payment.verified';
  aggregateType: 'Payment';
  payload: { paymentId: string; saleId: string; verifiedById: string; amount: number };
}
