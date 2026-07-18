import { forwardRef } from 'react';
import type { BadgeProps } from './Badge.types';
import { getBadgeClasses } from './Badge.styles';

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'neutral', size = 'md', className }, ref) => {
    return (
      <span ref={ref} className={getBadgeClasses(variant, size, className)}>
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
