import type { ReactNode, InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  required?: boolean;
}
