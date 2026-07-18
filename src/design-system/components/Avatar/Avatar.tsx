import { forwardRef, useState } from 'react';
import type { AvatarProps } from './Avatar.types';
import { getAvatarClasses } from './Avatar.styles';

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = 'md', fallback, className }, ref) => {
    const [imgError, setImgError] = useState(false);
    const showImage = !!src && !imgError;

    return (
      <div ref={ref} className={getAvatarClasses(size, className)} role="img" aria-label={alt}>
        {showImage ? (
          <img
            src={src}
            alt={alt}
            onError={() => { setImgError(true); }}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">
            {fallback ?? alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
