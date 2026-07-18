const base = 'shrink-0 bg-border';

const orientation = {
  horizontal: 'h-px w-full',
  vertical: 'h-full w-px',
} as const;

export function getDividerClasses(orientationKey: keyof typeof orientation, className?: string): string {
  return [base, orientation[orientationKey], className].filter(Boolean).join(' ');
}
