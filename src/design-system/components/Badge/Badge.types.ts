import type { ReactNode } from 'react';
import type { StatusVariant } from '@/design-system/types';

export interface BadgeProps {
  children: ReactNode;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  className?: string;
}
