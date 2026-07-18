const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[calc(100vw-2rem)]',
} as const;

export function getOverlayClasses(): string {
  return [
    'fixed inset-0 z-(--z-overlay) bg-overlay',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  ].join(' ');
}

export function getModalWrapperClasses(): string {
  return [
    'fixed inset-0 z-(--z-modal) flex items-center justify-center p-4',
  ].join(' ');
}

export function getModalContentClasses(sizeKey: keyof typeof sizeMap, className?: string): string {
  return [
    'relative w-full rounded-(--radius-2xl) bg-surface shadow-xl',
    'max-h-[90vh] overflow-y-auto',
    sizeMap[sizeKey],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getModalHeaderClasses(): string {
  return 'flex items-center justify-between gap-4 border-b border-border px-6 py-4';
}

export function getModalBodyClasses(): string {
  return 'px-6 py-4';
}

export function getModalTitleClasses(): string {
  return 'text-title font-semibold text-foreground';
}

export function getModalDescriptionClasses(): string {
  return 'text-body text-muted';
}
