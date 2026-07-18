export function getRadioGroupWrapperClasses(className?: string): string {
  return ['space-y-1.5', className].filter(Boolean).join(' ');
}

export function getRadioGroupClasses(direction: 'row' | 'column'): string {
  return direction === 'row' ? 'flex flex-wrap gap-4' : 'flex flex-col gap-3';
}

export function getRadioOptionClasses(): string {
  return 'flex items-start gap-3';
}

export function getRadioInputClasses(error?: string): string {
  return [
    'peer h-4 w-4 shrink-0 mt-0.5 appearance-none rounded-full border-2 border-border bg-surface',
    'cursor-pointer transition-(--transition-default)',
    'checked:border-4 checked:border-primary',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error && 'border-danger',
  ].join(' ');
}

export function getRadioLabelClasses(): string {
  return 'select-none text-label font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50';
}

export function getRadioDescriptionClasses(): string {
  return 'text-caption text-muted';
}
