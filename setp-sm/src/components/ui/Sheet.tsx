'use client';

import { useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoint?: number;
  title?: string;
}

export function Sheet({ isOpen, onClose, children, snapPoint = 320, title }: SheetProps) {
  const constraintsRef = useRef(null);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.y > 300 || info.offset.y > snapPoint / 2) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="sheet"
            ref={constraintsRef}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 40 }}
            style={{ height: snapPoint, borderRadius: '20px 20px 0 0' }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
          >
            <div
              className="flex flex-col h-full overflow-hidden"
              style={{ borderRadius: '20px 20px 0 0' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2 shrink-0">
                <div className="w-10 h-1.5 rounded-full bg-[var(--color-border)]" />
              </div>

              {title && (
                <div className="px-5 pb-3 shrink-0 border-b border-[var(--color-border)]">
                  <h2 className="text-[17px] font-semibold font-display text-[var(--color-text-primary)]">
                    {title}
                  </h2>
                </div>
              )}

              <div className="flex-1 overflow-y-auto no-scrollbar">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
