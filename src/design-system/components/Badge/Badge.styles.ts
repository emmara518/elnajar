const variantStyles = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  info: 'bg-info/15 text-info',
  neutral: 'bg-muted/15 text-muted',
} as const;

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-caption',
  md: 'px-2 py-0.5 text-label',
} as const;

export function getBadgeClasses(
  variantKey: keyof typeof variantStyles,
  sizeKey: keyof typeof sizeStyles,
  className?: string,
): string {
  return [
    'inline-flex items-center justify-center rounded-(--radius-sm) font-medium whitespace-nowrap',
    variantStyles[variantKey],
    sizeStyles[sizeKey],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
