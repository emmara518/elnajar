import type { ButtonVariant, ButtonSize } from './Button.types';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80',
  ghost: 'text-foreground hover:bg-muted/10 active:bg-muted/20',
  outline: 'border border-border text-foreground hover:bg-muted/10 active:bg-muted/20',
  danger: 'bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/80',
  success: 'bg-success text-success-foreground hover:bg-success/90 active:bg-success/80',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 min-w-7 px-2 text-xs gap-1',
  sm: 'h-8 min-w-8 px-3 text-label gap-1.5',
  md: 'h-10 min-w-10 px-4 text-label gap-2',
  lg: 'h-12 min-w-12 px-6 text-body gap-2',
  xl: 'h-14 min-w-14 px-8 text-lg gap-3',
};

export function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  isLoading: boolean,
  _disabled: boolean,
  className?: string,
): string {
  return [
    'inline-flex items-center justify-center rounded-(--radius-lg) font-medium whitespace-nowrap transition-(--transition-default)',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)',
    'disabled:pointer-events-none disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    isLoading && 'cursor-wait',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
