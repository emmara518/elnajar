export function getEmptyStateClasses(className?: string): string {
  return ['flex flex-col items-center justify-center gap-2 py-12 text-center', className]
    .filter(Boolean)
    .join(' ');
}
