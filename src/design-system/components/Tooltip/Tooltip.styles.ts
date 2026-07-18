const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 rtl:translate-x-1/2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 rtl:translate-x-1/2',
  left: 'right-full top-1/2 -translate-y-1/2 ml-2',
  right: 'left-full top-1/2 -translate-y-1/2 mr-2',
} as const;

export function getTooltipTriggerClasses(className?: string): string {
  return ['group relative inline-flex', className].filter(Boolean).join(' ');
}

export function getTooltipContentClasses(position: keyof typeof positionClasses): string {
  return [
    'pointer-events-none absolute z-(--z-dropdown) whitespace-nowrap rounded-(--radius-md) bg-foreground px-2 py-1 text-caption text-surface',
    'opacity-0 transition-(--transition-default) group-hover:opacity-100',
    positionClasses[position],
  ].join(' ');
}
