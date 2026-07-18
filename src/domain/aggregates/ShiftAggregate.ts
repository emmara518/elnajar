import type { Shift, Sale } from '../entities';
import type { Money } from '../value-objects';

/**
 * Shift Aggregate Root: Shift + associated Sales (referenced)
 *
 * BOUNDARY
 * - Root: Shift
 * - References (not owned): Sale[], Employee, Branch
 *
 * CONSISTENCY RULES
 * 1. A Shift MUST have an openingCash amount
 * 2. Sales CAN only be created within an open Shift
 * 3. When Shift is closed:
 *    a. All Sales in the shift must be confirmed or cancelled
 *    b. closingCash must be recorded
 *    c. cashDifference = closingCash - expectedCash
 *    d. If cashDifference exceeds threshold, discrepancy must be noted
 * 4. Expected cash = openingCash + sum of all cash payments - sum of all refunds
 * 5. A shift cannot be closed if it has pending (unconfirmed) sales
 * 6. Shifts are per-employee, per-branch, per-day
 */
export interface ShiftAggregate {
  shift: Shift;
  sales: Sale[];
}

export function calculateExpectedCash(aggregate: ShiftAggregate, currency: string): Money {
  const totalCashPayments = aggregate.sales
    .filter((s) => s.status === 'confirmed')
    .reduce((sum, sale) => sum + sale.paidAmount.amount, 0);

  const expectedAmount = aggregate.shift.openingCash.amount + totalCashPayments;
  return { amount: expectedAmount, currency };
}
