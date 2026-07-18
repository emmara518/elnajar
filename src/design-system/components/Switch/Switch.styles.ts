export function getSwitchWrapperClasses(className?: string): string {
  return ['flex items-center justify-between gap-4', className].filter(Boolean).join(' ');
}

export function getSwitchTrackClasses(): string {
  return [
    'relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
    'transition-(--transition-default)',
    'bg-muted/30',
    'peer-checked:bg-primary',
    'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--ring-color)',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  ].join(' ');
}

export function getSwitchThumbClasses(): string {
  return [
    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-(--transition-default)',
    'peer-checked:translate-x-4 rtl:peer-checked:-translate-x-4',
  ].join(' ');
}

export function getSwitchLabelClasses(): string {
  return 'select-none text-label font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed';
}

export function getSwitchDescriptionClasses(): string {
  return 'text-caption text-muted';
}
