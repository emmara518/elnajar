export function getSectionClasses(className?: string): string {
  return ['space-y-4', className].filter(Boolean).join(' ');
}
