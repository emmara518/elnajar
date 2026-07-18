import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'children'> {
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}
