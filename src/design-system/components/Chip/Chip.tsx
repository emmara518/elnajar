import { forwardRef } from 'react';
import { X } from 'lucide-react';
import type { ChipProps } from './Chip.types';
import { getChipClasses } from './Chip.styles';

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ children, variant = 'default', size = 'md', onRemove, className }, ref) => {
    return (
      <span ref={ref} className={getChipClasses(variant, size, className)}>
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="cursor-pointer rounded-full p-0.5 transition-(--transition-default) hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring-color"
            aria-label="إزالة"
          >
            <X size={size === 'sm' ? 12 : 14} aria-hidden="true" />
          </button>
        )}
      </span>
    );
  },
);

Chip.displayName = 'Chip';
