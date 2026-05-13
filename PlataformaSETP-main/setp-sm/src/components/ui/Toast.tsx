'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  visible: boolean;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: 'bg-[var(--color-success)] text-white',
  error: 'bg-[var(--color-error)] text-white',
  info: 'bg-[var(--color-primary)] text-white',
};

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  visible,
}: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    if (visible && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-4 left-4 right-4 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg ${colors[type]}`}
          role="alert"
        >
          <Icon size={18} className="shrink-0" />
          <span className="flex-1 text-sm font-medium">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook de conveniencia para manejar toasts
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const show = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const hide = () => setToast(null);

  return { toast, show, hide };
}
