import type { ButtonVariant } from '@/design-system/components/Button/Button.types';
import type { IconButtonSize } from './IconButton.types';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80',
  ghost: 'text-foreground hover:bg-muted/10 active:bg-muted/20',
  outline: 'border border-border text-foreground hover:bg-muted/10 active:bg-muted/20',
  danger: 'bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/80',
  success: 'bg-success text-success-foreground hover:bg-success/90 active:bg-success/80',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function getIconButtonClasses(
  variant: ButtonVariant,
  size: IconButtonSize,
  isLoading: boolean,
  _disabled: boolean,
  className?: string,
): string {
  return [
    'inline-flex items-center justify-center rounded-(--radius-lg) transition-(--transition-default)',
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
