import { forwardRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { DrawerProps } from './Drawer.types';
import {
  getDrawerWrapperClasses,
  getOverlayClasses,
  getDrawerPanelClasses,
  getDrawerHeaderClasses,
  getDrawerBodyClasses,
  getDrawerTitleClasses,
} from './Drawer.styles';

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  ({ isOpen, onClose, title, children, side = 'right', size = 'md', className }, ref) => {
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
      <div className={getDrawerWrapperClasses()}>
        <div className={getOverlayClasses()} onClick={onClose} aria-hidden="true" />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={getDrawerPanelClasses(side, size, className)}
        >
          <div className={getDrawerHeaderClasses()}>
            {title && <h2 className={getDrawerTitleClasses()}>{title}</h2>}
            <button
              type="button"
              onClick={onClose}
              className="flex cursor-pointer items-center justify-center rounded-(--radius-md) p-1.5 text-muted transition-(--transition-default) hover:bg-muted/10 focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="إغلاق"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className={getDrawerBodyClasses()}>{children}</div>
        </div>
      </div>,
      document.body,
    );
  },
);

Drawer.displayName = 'Drawer';
