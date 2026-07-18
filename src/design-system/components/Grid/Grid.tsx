import { forwardRef } from 'react';
import type { GridProps } from './Grid.types';
import { getGridClasses } from './Grid.styles';

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} className={getGridClasses(props)}>
        {children}
      </div>
    );
  },
);

Grid.displayName = 'Grid';
