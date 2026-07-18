import { forwardRef, useId } from 'react';
import type { RadioGroupProps } from './Radio.types';
import {
  getRadioGroupWrapperClasses,
  getRadioGroupClasses,
  getRadioOptionClasses,
  getRadioInputClasses,
  getRadioLabelClasses,
  getRadioDescriptionClasses,
} from './Radio.styles';

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      options,
      label,
      description,
      error,
      direction = 'column',
      disabled,
      className,
      id: externalId,
      value,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const groupId = externalId ?? generatedId;
    const errorId = error ? `${groupId}-error` : undefined;

    return (
      <fieldset className={getRadioGroupWrapperClasses(className)}>
        {label && (
          <legend className="text-label font-medium text-foreground">{label}</legend>
        )}

        {description && (
          <p className="text-caption text-muted">{description}</p>
        )}

        <div className={getRadioGroupClasses(direction)} role="radiogroup" aria-label={label}>
          {options.map((option) => (
            <div key={option.value} className={getRadioOptionClasses()}>
              <input
                ref={ref}
                type="radio"
                id={`${groupId}-${option.value}`}
                name={groupId}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled || option.disabled}
                aria-invalid={!!error}
                className={getRadioInputClasses(error)}
                {...rest}
              />
              <div className="space-y-0.5">
                <label
                  htmlFor={`${groupId}-${option.value}`}
                  className={getRadioLabelClasses()}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className={getRadioDescriptionClasses()}>{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p id={errorId} className="text-caption text-danger" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
