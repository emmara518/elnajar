import { forwardRef, useId, useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import type { CheckboxProps } from './Checkbox.types';
import {
  getCheckboxWrapperClasses,
  getCheckboxInputClasses,
  getCheckboxLabelClasses,
  getCheckboxDescriptionClasses,
} from './Checkbox.styles';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, indeterminate, disabled, className, id: externalId, ...rest }, ref) => {
    const generatedId = useId();
    const checkboxId = externalId ?? generatedId;
    const innerRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (ref ?? innerRef) as React.RefObject<HTMLInputElement | null>;

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate, resolvedRef]);

    return (
      <div className={getCheckboxWrapperClasses(className)}>
        <div className="relative shrink-0">
          <input
            ref={ref ?? innerRef}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            aria-invalid={!!error}
            className={getCheckboxInputClasses(error)}
            {...rest}
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-100">
            {indeterminate ? <Minus size={12} /> : <Check size={12} />}
          </span>
        </div>

        {(label || description) && (
          <div className="space-y-0.5">
            {label && (
              <label htmlFor={checkboxId} className={getCheckboxLabelClasses()}>
                {label}
              </label>
            )}
            {description && (
              <p className={getCheckboxDescriptionClasses()}>{description}</p>
            )}
          </div>
        )}

        {error && (
          <p className="text-caption text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
