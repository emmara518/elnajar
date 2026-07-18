const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-5',
  lg: 'p-6 md:p-8',
} as const;

export function getCardClasses(paddingKey: keyof typeof paddingMap, className?: string): string {
  return [
    'rounded-(--radius-xl) border border-border bg-surface shadow-sm',
    paddingMap[paddingKey],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getCardHeaderClasses(className?: string): string {
  return ['flex items-center justify-between gap-4', className].filter(Boolean).join(' ');
}

export function getCardBodyClasses(className?: string): string {
  return ['', className].filter(Boolean).join(' ');
}

export function getCardFooterClasses(className?: string): string {
  return ['flex items-center gap-4', className].filter(Boolean).join(' ');
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const;

export function getCardActionsClasses(justifyKey: keyof typeof justifyMap, className?: string): string {
  return ['flex items-center gap-3', justifyMap[justifyKey], className].filter(Boolean).join(' ');
}
