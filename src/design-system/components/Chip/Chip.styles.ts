const variantStyles = {
  default: 'bg-muted/10 text-foreground',
  primary: 'bg-primary/15 text-primary',
  outline: 'border border-border text-foreground bg-transparent',
} as const;

const sizeStyles = {
  sm: 'px-2 py-0.5 text-caption gap-1',
  md: 'px-3 py-1 text-label gap-1.5',
} as const;

export function getChipClasses(
  variantKey: keyof typeof variantStyles,
  sizeKey: keyof typeof sizeStyles,
  className?: string,
): string {
  return [
    'inline-flex items-center rounded-(--radius-full) font-medium whitespace-nowrap transition-(--transition-default)',
    variantStyles[variantKey],
    sizeStyles[sizeKey],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
