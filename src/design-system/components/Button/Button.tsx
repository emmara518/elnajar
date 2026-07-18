import { forwardRef } from 'react';
import { Spinner } from '@/design-system/components/Spinner';
import type { ButtonProps } from './Button.types';
import { getButtonClasses } from './Button.styles';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        className={getButtonClasses(variant, size, isLoading, isDisabled, className) + (fullWidth ? ' w-full' : '')}
        {...rest}
      >
        {isLoading && <Spinner size="sm" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
