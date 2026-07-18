export interface Percentage {
  readonly value: number;
}

export function createPercentage(value: number): Percentage {
  if (value < 0 || value > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }
  return { value };
}

export function applyPercentage(base: number, percentage: Percentage): number {
  return (base * percentage.value) / 100;
}

export function percentageToDecimal(pct: Percentage): number {
  return pct.value / 100;
}
