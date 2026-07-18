const sideClasses = {
  left: 'left-0 top-0 h-full border-l',
  right: 'right-0 top-0 h-full border-r',
} as const;

const sizeMap = {
  sm: 'w-72',
  md: 'w-96',
  lg: 'w-[32rem]',
  full: 'w-full',
} as const;

export function getDrawerWrapperClasses(): string {
  return 'fixed inset-0 z-(--z-modal)';
}

export function getOverlayClasses(): string {
  return 'fixed inset-0 z-(--z-overlay) bg-overlay';
}

export function getDrawerPanelClasses(sideKey: keyof typeof sideClasses, sizeKey: keyof typeof sizeMap, className?: string): string {
  return [
    'fixed z-(--z-modal) bg-surface shadow-xl overflow-y-auto',
    'flex flex-col',
    sideClasses[sideKey],
    sizeMap[sizeKey],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getDrawerHeaderClasses(): string {
  return 'flex items-center justify-between gap-4 border-b border-border px-4 py-4';
}

export function getDrawerBodyClasses(): string {
  return 'flex-1 overflow-y-auto px-4 py-4';
}

export function getDrawerTitleClasses(): string {
  return 'text-title font-semibold text-foreground';
}
