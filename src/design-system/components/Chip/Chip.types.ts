import type { ReactNode } from 'react';

export interface ChipProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'outline';
  size?: 'sm' | 'md';
  onRemove?: () => void;
  className?: string;
}
