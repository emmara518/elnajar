import { AlertTriangle } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorPage({
  title = 'حدث خطأ',
  description = 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  onRetry,
}: ErrorPageProps) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
      role="alert"
    >
      <AlertTriangle size={48} className="text-red-400" aria-hidden="true" />
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-(--radius-lg) bg-black px-6 py-2 text-sm font-medium text-white transition-(--transition-default) hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
