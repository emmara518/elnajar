import type { InputHTMLAttributes } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'> {
  options: RadioOption[];
  label?: string;
  description?: string;
  error?: string;
  direction?: 'row' | 'column';
}
