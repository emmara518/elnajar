export interface Email {
  readonly localPart: string;
  readonly domain: string;
  readonly full: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createEmail(value: string): Email {
  if (!EMAIL_REGEX.test(value)) {
    throw new Error(`Invalid email address: ${value}`);
  }
  const parts = value.split('@');
  return {
    localPart: parts[0] ?? '',
    domain: parts[1] ?? '',
    full: value.toLowerCase(),
  };
}
