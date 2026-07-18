import type { ToastVariant } from './Toast.types';

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-r-4 border-success bg-success/10',
  warning: 'border-r-4 border-warning bg-warning/10',
  danger: 'border-r-4 border-danger bg-danger/10',
  info: 'border-r-4 border-info bg-info/10',
};

const positionMap = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
} as const;

export function getToastClasses(variant: ToastVariant, className?: string): string {
  return [
    'flex items-start gap-3 rounded-(--radius-lg) px-4 py-3 shadow-lg',
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getToastContainerClasses(position: keyof typeof positionMap): string {
  return ['fixed z-(--z-toast) flex flex-col gap-2', positionMap[position]].join(' ');
}

export function getToastMessageClasses(): string {
  return 'text-label font-medium text-foreground';
}

export function getToastDescriptionClasses(): string {
  return 'text-caption text-muted';
}
