import { forwardRef } from 'react';
import type { SpinnerProps } from './Spinner.types';
import { getSpinnerClasses } from './Spinner.styles';

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', className, label = 'جار التحميل...' }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2"
      >
        <div className={getSpinnerClasses(size, className)} />
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);

Spinner.displayName = 'Spinner';
