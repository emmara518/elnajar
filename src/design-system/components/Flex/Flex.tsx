import { forwardRef } from 'react';
import type { FlexProps } from './Flex.types';
import { getFlexClasses } from './Flex.styles';

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} className={getFlexClasses(props)}>
        {children}
      </div>
    );
  },
);

Flex.displayName = 'Flex';
