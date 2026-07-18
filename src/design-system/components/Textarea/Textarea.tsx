import { forwardRef, useId } from 'react';
import type { TextareaProps } from './Textarea.types';
import { getTextareaWrapperClasses, getTextareaClasses } from './Textarea.styles';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      helperText,
      error,
      success,
      required,
      disabled,
      className,
      id: externalId,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = externalId ?? generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText && !error ? `${textareaId}-helper` : undefined;

    return (
      <div className={getTextareaWrapperClasses(error, disabled, className)}>
        {label && (
          <label htmlFor={textareaId} className="text-label font-medium text-foreground">
            {label}
            {required && <span className="mr-1 text-danger" aria-hidden="true">*</span>}
          </label>
        )}

        {description && (
          <p className="text-caption text-muted">{description}</p>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId ?? helperId}
          className={getTextareaClasses(error, success)}
          {...rest}
        />

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

Textarea.displayName = 'Textarea';
