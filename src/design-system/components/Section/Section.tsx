import { forwardRef } from 'react';
import type { SectionProps } from './Section.types';
import { getSectionClasses } from './Section.styles';

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, title, description, actions, className, as: Tag = 'section' }, ref) => {
    return (
      <Tag ref={ref} className={getSectionClasses(className)}>
        {(title || actions) && (
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              {title && <h2 className="text-title text-foreground">{title}</h2>}
              {description && <p className="text-body text-muted">{description}</p>}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </Tag>
    );
  },
);

Section.displayName = 'Section';
