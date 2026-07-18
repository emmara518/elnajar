import { forwardRef } from 'react';
import type { DividerProps } from './Divider.types';
import { getDividerClasses } from './Divider.styles';

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = 'horizontal', className }, ref) => {
    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={getDividerClasses(orientation, className)}
      />
    );
  },
);

Divider.displayName = 'Divider';
