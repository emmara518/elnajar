import type { Sale, SaleItem, Payment } from '../entities';

/**
 * Sale Aggregate Root: Sale + SaleItems + Payments
 *
 * BOUNDARY
 * - Root: Sale
 * - Children: SaleItem[], Payment[]
 * - References (not owned): Customer, Employee, Branch, Shift
 *
 * CONSISTENCY RULES
 * 1. Sale.grandTotal MUST equal sum of all SaleItem.totalPrice
 * 2. Sale.paidAmount MUST equal sum of all Payment.amount
 * 3. Sale.changeAmount = Sale.paidAmount - Sale.grandTotal
 * 4. When Sale.status = 'confirmed', all SaleItems become immutable
 * 5. When Sale.status = 'cancelled', inventory must be restored
 * 6. A Sale MUST belong to an open Shift
 * 7. SaleItems must reference valid Products
 * 8. Payments cannot exceed Sale.grandTotal by more than a configured threshold
 * 9. Sale.discountTotal = sum of SaleItem.discountAmount
 * 10. Sale.taxTotal = sum of SaleItem.taxAmount
 */
export interface SaleAggregate {
  sale: Sale;
  items: SaleItem[];
  payments: Payment[];
}

export function calculateSaleTotals(aggregate: SaleAggregate): void {
  const { sale, items } = aggregate;
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice.amount, 0);
  const discountTotal = items.reduce((sum, item) => sum + item.discountAmount.amount, 0);
  const taxTotal = items.reduce((sum, item) => sum + item.taxAmount.amount, 0);

  sale.subtotal = { amount: subtotal, currency: sale.subtotal.currency };
  sale.discountTotal = { amount: discountTotal, currency: sale.discountTotal.currency };
  sale.taxTotal = { amount: taxTotal, currency: sale.taxTotal.currency };
  sale.grandTotal = { amount: subtotal + taxTotal - discountTotal, currency: sale.grandTotal.currency };
}
