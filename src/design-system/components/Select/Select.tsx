import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SelectProps } from './Select.types';
import { getSelectWrapperClasses, getSelectClasses } from './Select.styles';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      description,
      helperText,
      error,
      options,
      placeholder,
      required,
      disabled,
      className,
      id: externalId,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = externalId ?? generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className={getSelectWrapperClasses(error, disabled, className)}>
        {label && (
          <label htmlFor={selectId} className="text-label font-medium text-foreground">
            {label}
            {required && <span className="mr-1 text-danger" aria-hidden="true">*</span>}
          </label>
        )}

        {description && (
          <p className="text-caption text-muted">{description}</p>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={getSelectClasses(error)}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted rtl:left-auto rtl:right-3"
            aria-hidden="true"
          />
        </div>

        {error && (
          <p id={errorId} className="text-caption text-danger" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-caption text-muted">{helperText}</p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
