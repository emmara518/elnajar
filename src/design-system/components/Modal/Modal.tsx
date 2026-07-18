import { forwardRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ModalProps } from './Modal.types';
import {
  getOverlayClasses,
  getModalWrapperClasses,
  getModalContentClasses,
  getModalHeaderClasses,
  getModalBodyClasses,
  getModalTitleClasses,
  getModalDescriptionClasses,
} from './Modal.styles';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, description, children, size = 'md', className }, ref) => {
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      },
      [onClose],
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return createPortal(
      <div className={getModalWrapperClasses()} role="dialog" aria-modal="true" aria-label={title}>
        <div
          className={getOverlayClasses()}
          onClick={onClose}
          aria-hidden="true"
        />
        <div ref={ref} className={getModalContentClasses(size, className)}>
          {(title || description) && (
            <div className={getModalHeaderClasses()}>
              <div className="space-y-1">
                {title && <h2 className={getModalTitleClasses()}>{title}</h2>}
                {description && <p className={getModalDescriptionClasses()}>{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex cursor-pointer items-center justify-center rounded-(--radius-md) p-1.5 text-muted transition-(--transition-default) hover:bg-muted/10 focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label="إغلاق"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
          )}
          <div className={getModalBodyClasses()}>{children}</div>
        </div>
      </div>,
      document.body,
    );
  },
);

Modal.displayName = 'Modal';
