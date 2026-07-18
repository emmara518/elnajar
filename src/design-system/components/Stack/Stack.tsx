import { forwardRef } from 'react';
import type { StackProps } from './Stack.types';
import { getStackClasses } from './Stack.styles';

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} className={getStackClasses(props)}>
        {children}
      </div>
    );
  },
);

Stack.displayName = 'Stack';
