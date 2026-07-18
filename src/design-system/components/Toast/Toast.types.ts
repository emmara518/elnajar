import type { ReactNode } from 'react';

export type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

export interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ReactNode;
  className?: string;
}

export interface ToastContainerProps {
  children: ReactNode;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}
