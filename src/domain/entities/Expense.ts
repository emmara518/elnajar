import type { Entity } from '../shared';
import type { Money } from '../value-objects';
import type { ExpenseCategory } from '../types';

/**
 * Operational expense recorded against a branch.
 * Covers rent, utilities, salaries, supplies, maintenance, etc.
 * Expenses are separate from cost of goods sold (categorized via ExpenseCategory).
 */
export interface Expense extends Entity {
  branchId: string;
  category: ExpenseCategory;
  amount: Money;
  description: string;
  receiptUrl?: string;
  recordedById: string;
  expenseDate: string;
  isTaxDeductible: boolean;
}

export type CreateExpensePayload = {
  branchId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  receiptUrl?: string;
  recordedById: string;
  expenseDate: string;
  isTaxDeductible?: boolean;
};
