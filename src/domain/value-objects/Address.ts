export interface Address {
  readonly street: string;
  readonly district: string;
  readonly city: string;
  readonly state?: string;
  readonly postalCode?: string;
  readonly country: string;
  readonly full: string;
  readonly coordinates?: GeoLocation;
}

export interface GeoLocation {
  readonly latitude: number;
  readonly longitude: number;
}

export function createAddress(params: Omit<Address, 'full'>): Address {
  const parts = [params.street, params.district, params.city];
  if (params.state) parts.push(params.state);
  parts.push(params.country);
  return {
    ...params,
    full: parts.join('، '),
  };
}
