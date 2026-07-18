export function getSkeletonClasses(className?: string): string {
  return ['animate-pulse bg-muted/20', className].filter(Boolean).join(' ');
}
