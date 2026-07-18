import { forwardRef } from 'react';
import { Spinner } from '@/design-system/components/Spinner';
import type { IconButtonProps } from './IconButton.types';
import { getIconButtonClasses } from './IconButton.styles';

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      label,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
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
        aria-label={label}
        aria-busy={isLoading}
        className={getIconButtonClasses(variant, size, isLoading, isDisabled, className)}
        {...rest}
      >
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <Icon size={size === 'lg' ? 24 : size === 'sm' ? 16 : 20} aria-hidden="true" />
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
