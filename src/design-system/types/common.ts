import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type PolymorphicProps<E extends ElementType> = {
  as?: E;
  children?: ReactNode;
} & ComponentPropsWithoutRef<E>;

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger' | 'success' | 'warning';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
