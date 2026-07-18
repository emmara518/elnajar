export interface Money {
  readonly amount: number;
  readonly currency: string;
}

export function createMoney(amount: number, currency: string = 'EGP'): Money {
  return { amount: Math.round(amount * 100) / 100, currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error('Currency mismatch');
  return createMoney(a.amount + b.amount, a.currency);
}

export function multiplyMoney(money: Money, factor: number): Money {
  return createMoney(money.amount * factor, money.currency);
}

export function formatMoney(money: Money): string {
  return `${money.amount.toFixed(2)} ${money.currency}`;
}
