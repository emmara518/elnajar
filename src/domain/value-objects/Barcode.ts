export type BarcodeType = 'EAN13' | 'EAN8' | 'UPC' | 'CODE128' | 'QR';

export interface Barcode {
  readonly value: string;
  readonly type: BarcodeType;
}

export function createBarcode(value: string, type: BarcodeType = 'EAN13'): Barcode {
  const cleaned = value.trim();
  if (cleaned.length === 0) throw new Error('Barcode cannot be empty');
  return { value: cleaned, type };
}
