import type { ReactNode } from 'react';

export interface FlexProps {
  children?: ReactNode;
  inline?: boolean;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | string;
  flex?: '1' | 'auto' | 'initial' | 'none';
  className?: string;
}
