import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
      role="alert"
    >
      <FileQuestion size={48} className="text-gray-300" aria-hidden="true" />
      <h1 className="text-xl font-semibold text-gray-900">الصفحة غير موجودة</h1>
      <p className="max-w-sm text-sm text-gray-500">
        عذراً، الصفحة التي تبحث عنها غير موجودة.
      </p>
      <button
        type="button"
        onClick={() => void navigate('/')}
        className="cursor-pointer rounded-(--radius-lg) bg-black px-6 py-2 text-sm font-medium text-white transition-(--transition-default) hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
      >
        العودة إلى الرئيسية
      </button>
    </div>
  );
}
