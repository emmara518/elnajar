export function getAspectRatioClasses(className?: string): string {
  return ['relative w-full', className].filter(Boolean).join(' ');
}
