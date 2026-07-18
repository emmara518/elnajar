export interface SKU {
  readonly value: string;
}

const SKU_PATTERN = /^[A-Za-z0-9_-]{3,50}$/;

export function createSKU(value: string): SKU {
  const cleaned = value.trim().toUpperCase();
  if (!SKU_PATTERN.test(cleaned)) {
    throw new Error('SKU must be 3-50 alphanumeric characters, hyphens or underscores');
  }
  return { value: cleaned };
}
