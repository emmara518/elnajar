import type { Entity } from '../shared';
import type { Money } from '../value-objects';
import type { ShiftStatus } from '../types';

/**
 * Cashier or employee work session at a specific branch.
 * Tracks opening and closing cash amounts, sales during shift, and discrepancies.
 * Every Sale must belong to a Shift.
 * Shifts enforce accountability — cashiers are responsible for their shift balance.
 */
export interface Shift extends Entity {
  branchId: string;
  employeeId: string;
  status: ShiftStatus;
  openedAt: string;
  closedAt?: string;
  openingCash: Money;
  closingCash?: Money;
  expectedCash?: Money;
  cashDifference?: Money;
  totalSales: number;
  notes?: string;
}

export type CreateShiftPayload = {
  branchId: string;
  employeeId: string;
  openingCash: number;
  notes?: string;
};
