'use client';

import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-2"
      style={{ backgroundColor: 'var(--color-offline-bg)', color: 'var(--color-offline-text)' }}
      role="alert"
      aria-live="polite"
    >
      <WifiOff size={14} />
      <span className="text-xs font-medium">Sin conexión — mostrando datos cacheados</span>
    </div>
  );
}
