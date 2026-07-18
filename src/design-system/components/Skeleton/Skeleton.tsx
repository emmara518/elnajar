import { forwardRef, type CSSProperties } from 'react';

import type { SkeletonProps } from './Skeleton.types';
import { getSkeletonClasses } from './Skeleton.styles';

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, radius, className }, ref) => {
    const style: CSSProperties = {
      ...(width != null ? { width } : {}),
      ...(height != null ? { height } : {}),
      ...(radius != null ? { borderRadius: radius } : {}),
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={getSkeletonClasses(className)}
        style={style}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
