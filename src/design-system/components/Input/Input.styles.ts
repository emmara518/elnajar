export function getInputWrapperClasses(_error?: string, _disabled?: boolean, className?: string): string {
  return ['space-y-1.5', className].filter(Boolean).join(' ');
}

export function getInputContainerClasses(error?: string, success?: boolean): string {
  const borderColor = error
    ? 'border-danger'
    : success
      ? 'border-success'
      : 'border-border';

  return [
    'flex items-center gap-2 rounded-(--radius-lg) border bg-surface px-3 py-0 transition-(--transition-default)',
    'has-[input:focus]:border-(--ring-color) has-[input:focus]:ring-2 has-[input:focus]:ring-(--ring-color)/20',
    'has-[input:disabled]:bg-muted/10 has-[input:disabled]:cursor-not-allowed',
    borderColor,
  ].join(' ');
}

export function getInputClasses(): string {
  return [
    'flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'h-9',
  ].join(' ');
}
