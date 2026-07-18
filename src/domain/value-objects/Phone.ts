export interface Phone {
  readonly countryCode: string;
  readonly number: string;
  readonly formatted: string;
}

export function createPhone(countryCode: string, number: string): Phone {
  const digits = number.replace(/\D/g, '');
  const code = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
  return {
    countryCode: code,
    number: digits,
    formatted: `${code} ${digits}`,
  };
}
