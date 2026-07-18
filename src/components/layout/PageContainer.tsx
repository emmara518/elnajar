import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main
      className={`mx-auto w-full max-w-(--container-xl) px-4 md:px-6 ${className}`}
    >
      {children}
    </main>
  );
}
