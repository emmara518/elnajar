const maxWidthMap = {
  sm: 'max-w-(--container-sm)',
  md: 'max-w-(--container-md)',
  lg: 'max-w-(--container-lg)',
  xl: 'max-w-(--container-xl)',
  '2xl': 'max-w-(--container-2xl)',
  full: 'max-w-full',
} as const;

export function getContainerClasses(maxWidthKey: keyof typeof maxWidthMap, className?: string): string {
  return ['mx-auto w-full px-4 md:px-6', maxWidthMap[maxWidthKey], className]
    .filter(Boolean)
    .join(' ');
}
