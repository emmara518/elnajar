import { forwardRef, isValidElement } from 'react';
import type { EmptyStateProps } from './EmptyState.types';
import { getEmptyStateClasses } from './EmptyState.styles';

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className }, ref) => {
    const renderIcon = () => {
      if (!icon) return null;
      if (isValidElement(icon)) {
        return <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">{icon}</div>;
      }
      const IconComponent = icon as unknown as React.ComponentType<{ size?: number; className?: string }>;
      return (
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
          <IconComponent size={32} className="text-muted" aria-hidden="true" />
        </div>
      );
    };

    return (
      <div ref={ref} className={getEmptyStateClasses(className)}>
        {renderIcon()}
        <h3 className="text-title font-semibold text-foreground">{title}</h3>
        {description && <p className="max-w-sm text-body text-muted">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';
