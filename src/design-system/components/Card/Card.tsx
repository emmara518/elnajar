import { forwardRef } from 'react';
import type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps, CardActionsProps } from './Card.types';
import {
  getCardClasses,
  getCardHeaderClasses,
  getCardBodyClasses,
  getCardFooterClasses,
  getCardActionsClasses,
} from './Card.styles';

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, padding = 'md', className }, ref) => {
    return (
      <div ref={ref} className={getCardClasses(padding, className)}>
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={getCardHeaderClasses(className)}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={getCardBodyClasses(className)}>
        {children}
      </div>
    );
  },
);

CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={getCardFooterClasses(className)}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, justify = 'end', className }, ref) => {
    return (
      <div ref={ref} className={getCardActionsClasses(justify, className)}>
        {children}
      </div>
    );
  },
);

CardActions.displayName = 'CardActions';
