import { forwardRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ToastProps, ToastContainerProps } from './Toast.types';
import {
  getToastClasses,
  getToastContainerClasses,
  getToastMessageClasses,
  getToastDescriptionClasses,
} from './Toast.styles';

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { isOpen, onClose, message, description, variant = 'info', duration = 5000, action, className },
    ref,
  ) => {
    const handleAutoClose = useCallback((): void => { onClose(); }, [onClose]);

    useEffect(() => {
      if (!isOpen || duration <= 0) return;
      const timer = setTimeout(handleAutoClose, duration);
      return () => { clearTimeout(timer); };
    }, [isOpen, duration, handleAutoClose]);

    if (!isOpen) return null;

    return createPortal(
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        className={getToastClasses(variant, className)}
      >
        <div className="flex-1 space-y-0.5">
          <p className={getToastMessageClasses()}>{message}</p>
          {description && <p className={getToastDescriptionClasses()}>{description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {action}
          <button
            type="button"
            onClick={onClose}
            className="flex cursor-pointer items-center justify-center rounded-(--radius-md) p-1 text-muted transition-(--transition-default) hover:bg-black/10 focus-visible:outline-2"
            aria-label="إغلاق"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>,
      document.body,
    );
  },
);

Toast.displayName = 'Toast';

export function ToastContainer({ children, position = 'bottom-right' }: ToastContainerProps) {
  return (
    <div className={getToastContainerClasses(position)}>
      {children}
    </div>
  );
}
