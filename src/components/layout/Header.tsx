import { useCallback } from 'react';
import { useNavigate, useMatches } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { RouteHandle } from '@/types';

interface HeaderProps {
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({ rightAction, className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const handle = lastMatch?.handle as RouteHandle | undefined;
  const title = handle?.title ?? '';

  const handleBack = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  const canGoBack = matches.length > 1;

  return (
    <header
      className={`safe-inset-top sticky top-0 z-(--z-sticky) flex h-14 items-center gap-2 border-b border-gray-100 bg-white px-4 md:h-16 md:px-6 ${className}`}
      role="banner"
    >
      {canGoBack && (
        <button
          type="button"
          onClick={handleBack}
          className="flex cursor-pointer items-center justify-center rounded-(--radius-md) p-1 transition-(--transition-default) hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          aria-label="رجوع"
        >
          <ArrowRight
            size={24}
            className="rtl:rotate-180"
            aria-hidden="true"
          />
        </button>
      )}

      <h1 className="flex-1 text-lg font-semibold text-gray-900">
        {title}
      </h1>

      {rightAction && (
        <div className="flex items-center">{rightAction}</div>
      )}
    </header>
  );
}
