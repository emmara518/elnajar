import type { ReactNode } from 'react';

export interface StackProps {
  children?: ReactNode;
  direction?: 'row' | 'column';
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  gap?: string | number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  className?: string;
}
