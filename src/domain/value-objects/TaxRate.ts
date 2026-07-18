import type { TaxType } from '../types';
import { createPercentage } from './Percentage';
import type { Percentage } from './Percentage';

export interface TaxRate {
  readonly percentage: Percentage;
  readonly type: TaxType;
  readonly label: string;
}

export function createTaxRate(value: number, type: TaxType, label: string): TaxRate {
  return { percentage: createPercentage(value), type, label };
}

export function calculateTax(amount: number, taxRate: TaxRate): number {
  return (amount * taxRate.percentage.value) / 100;
}
