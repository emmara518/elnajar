import type { ReactNode } from 'react';

export interface GridProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | Record<string, number>;
  sm?: 1 | 2 | 3 | 4;
  md?: 1 | 2 | 3 | 4 | 6;
  lg?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | string;
  className?: string;
}
