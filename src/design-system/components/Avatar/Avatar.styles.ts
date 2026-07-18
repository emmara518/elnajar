const sizeMap = {
  sm: 'h-8 w-8 text-label',
  md: 'h-10 w-10 text-body',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
} as const;

export function getAvatarClasses(sizeKey: keyof typeof sizeMap, className?: string): string {
  return [
    'relative inline-flex shrink-0 items-center justify-center rounded-full bg-muted/15 font-medium text-muted overflow-hidden',
    sizeMap[sizeKey],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
