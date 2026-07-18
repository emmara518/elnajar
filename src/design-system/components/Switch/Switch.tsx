import { forwardRef, useId } from 'react';
import type { SwitchProps } from './Switch.types';
import {
  getSwitchWrapperClasses,
  getSwitchTrackClasses,
  getSwitchThumbClasses,
  getSwitchLabelClasses,
  getSwitchDescriptionClasses,
} from './Switch.styles';

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, disabled, className, id: externalId, ...rest }, ref) => {
    const generatedId = useId();
    const switchId = externalId ?? generatedId;

    return (
      <div className={getSwitchWrapperClasses(className)}>
        {(label || description) && (
          <div className="space-y-0.5">
            {label && (
              <label htmlFor={switchId} className={getSwitchLabelClasses()}>
                {label}
              </label>
            )}
            {description && (
              <p className={getSwitchDescriptionClasses()}>{description}</p>
            )}
          </div>
        )}

        <label htmlFor={switchId} className="relative shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            disabled={disabled}
            role="switch"
            className="peer sr-only"
            {...rest}
          />
          <span className={getSwitchTrackClasses()} aria-hidden="true">
            <span className={getSwitchThumbClasses()} />
          </span>
        </label>
      </div>
    );
  },
);

Switch.displayName = 'Switch';
