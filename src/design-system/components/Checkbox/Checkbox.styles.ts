export function getCheckboxWrapperClasses(className?: string): string {
  return ['flex items-start gap-3', className].filter(Boolean).join(' ');
}

export function getCheckboxInputClasses(error?: string): string {
  return [
    'peer h-4 w-4 shrink-0 mt-0.5 rounded-(--radius-sm) border-2 border-border bg-surface',
    'appearance-none cursor-pointer transition-(--transition-default)',
    'checked:bg-primary checked:border-primary',
    'indeterminate:bg-primary indeterminate:border-primary',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error && 'border-danger',
  ].join(' ');
}

export function getCheckboxLabelClasses(): string {
  return 'select-none text-label font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50';
}

export function getCheckboxDescriptionClasses(): string {
  return 'text-caption text-muted';
}
