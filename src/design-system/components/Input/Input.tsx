import { forwardRef, useId } from 'react';
import type { InputProps } from './Input.types';
import { getInputWrapperClasses, getInputContainerClasses, getInputClasses } from './Input.styles';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      helperText,
      error,
      success,
      prefix,
      suffix,
      required,
      disabled,
      className,
      id: externalId,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = externalId ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    return (
      <div className={getInputWrapperClasses(error, disabled, className)}>
        {label && (
          <label htmlFor={inputId} className="text-label font-medium text-foreground">
            {label}
            {required && <span className="mr-1 text-danger" aria-hidden="true">*</span>}
          </label>
        )}

        {description && (
          <p className="text-caption text-muted">{description}</p>
        )}

        <div className={getInputContainerClasses(error, success)}>
          {prefix && <span className="text-muted shrink-0">{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={errorId ?? helperId}
            className={getInputClasses()}
            {...rest}
          />
          {suffix && <span className="text-muted shrink-0">{suffix}</span>}
        </div>

        {error && (
          <p id={errorId} className="text-caption text-danger" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-caption text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
