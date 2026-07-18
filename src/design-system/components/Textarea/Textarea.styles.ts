export function getTextareaWrapperClasses(_error?: string, _disabled?: boolean, className?: string): string {
  return ['space-y-1.5', className].filter(Boolean).join(' ');
}

export function getTextareaClasses(error?: string, success?: boolean): string {
  const borderColor = error
    ? 'border-danger'
    : success
      ? 'border-success'
      : 'border-border';

  return [
    'w-full rounded-(--radius-lg) border bg-surface px-3 py-2.5 text-body text-foreground outline-none',
    'transition-(--transition-default) placeholder:text-muted-foreground',
    'focus:border-(--ring-color) focus:ring-2 focus:ring-(--ring-color)/20',
    'disabled:cursor-not-allowed disabled:bg-muted/10 disabled:opacity-50',
    'resize-y min-h-[80px]',
    borderColor,
  ].join(' ');
}
