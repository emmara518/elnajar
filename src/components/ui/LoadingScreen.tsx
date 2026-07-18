import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  label?: string;
}

export function LoadingScreen({ label = 'جار التحميل...' }: LoadingScreenProps) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <Loader2
        size={40}
        className="animate-spin text-gray-400"
        aria-hidden="true"
      />
      <p className="text-sm text-gray-500">{label}</p>
      <span className="sr-only">{label}</span>
    </div>
  );
}
