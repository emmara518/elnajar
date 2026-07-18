export interface Quantity {
  readonly value: number;
  readonly unit: string;
}

export function createQuantity(value: number, unit: string = 'piece'): Quantity {
  if (value < 0) throw new Error('Quantity cannot be negative');
  return { value, unit };
}

export function addQuantity(a: Quantity, b: Quantity): Quantity {
  if (a.unit !== b.unit) throw new Error('Unit mismatch');
  return createQuantity(a.value + b.value, a.unit);
}

export function subtractQuantity(a: Quantity, b: Quantity): Quantity {
  if (a.unit !== b.unit) throw new Error('Unit mismatch');
  const result = a.value - b.value;
  if (result < 0) throw new Error('Insufficient quantity');
  return createQuantity(result, a.unit);
}
