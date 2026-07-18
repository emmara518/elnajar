import type { DiscountType } from '../types';

export interface Discount {
  readonly type: DiscountType;
  readonly value: number;
  readonly label: string;
}

export function createPercentageDiscount(percentage: number, label: string): Discount {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage discount must be between 0 and 100');
  }
  return { type: 'percentage', value: percentage, label };
}

export function createFixedDiscount(amount: number, label: string): Discount {
  if (amount < 0) throw new Error('Fixed discount cannot be negative');
  return { type: 'fixed_amount', value: amount, label };
}

export function applyDiscount(baseAmount: number, discount: Discount): number {
  if (discount.type === 'percentage') {
    return baseAmount * (1 - discount.value / 100);
  }
  return Math.max(0, baseAmount - discount.value);
}
