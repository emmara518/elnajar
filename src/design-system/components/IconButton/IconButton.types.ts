import type { ComponentPropsWithoutRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ButtonVariant } from '@/design-system/components/Button/Button.types';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> {
  icon: LucideIcon;
  label: string;
  variant?: ButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
  className?: string;
}
