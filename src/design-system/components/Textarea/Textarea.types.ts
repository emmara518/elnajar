import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
}
