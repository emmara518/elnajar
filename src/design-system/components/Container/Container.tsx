import { forwardRef } from 'react';
import type { ContainerProps } from './Container.types';
import { getContainerClasses } from './Container.styles';

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, maxWidth = 'xl', className }, ref) => {
    return (
      <div ref={ref} className={getContainerClasses(maxWidth, className)}>
        {children}
      </div>
    );
  },
);

Container.displayName = 'Container';
