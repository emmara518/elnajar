import type { ReactNode } from 'react';

export interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  as?: 'section' | 'div';
  padding?: string;
  background?: string;
}
