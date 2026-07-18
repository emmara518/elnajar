import { forwardRef } from 'react';
import type { TooltipProps } from './Tooltip.types';
import { getTooltipTriggerClasses, getTooltipContentClasses } from './Tooltip.styles';

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, content, position = 'top', className }, ref) => {
    return (
      <div ref={ref} className={getTooltipTriggerClasses(className)}>
        {children}
        <span
          role="tooltip"
          className={getTooltipContentClasses(position)}
        >
          {content}
        </span>
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
