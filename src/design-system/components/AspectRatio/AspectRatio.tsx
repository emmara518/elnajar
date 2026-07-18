import { forwardRef } from 'react';
import type { AspectRatioProps } from './AspectRatio.types';
import { getAspectRatioClasses } from './AspectRatio.styles';

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ children, ratio = 16 / 9, className }, ref) => {
    return (
      <div
        ref={ref}
        className={getAspectRatioClasses(className)}
        style={{ paddingBottom: `${String((1 / ratio) * 100)}%` }}
      >
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  },
);

AspectRatio.displayName = 'AspectRatio';
