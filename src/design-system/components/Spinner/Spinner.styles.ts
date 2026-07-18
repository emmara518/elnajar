const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
} as const;

export function getSpinnerClasses(sizeKey: keyof typeof sizeMap, className?: string): string {
  return ['animate-spin rounded-full border-current border-t-transparent text-muted', sizeMap[sizeKey], className]
    .filter(Boolean)
    .join(' ');
}
