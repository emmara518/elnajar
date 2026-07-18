import type { ReactNode } from 'react';

interface SafeAreaProps {
  top?: boolean;
  bottom?: boolean;
  children: ReactNode;
}

export function SafeArea({ top, bottom, children }: SafeAreaProps) {
  const classes = [
    top && 'safe-inset-top',
    bottom && 'safe-inset-bottom',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
