'use client';

import { getRouteColor } from '@/lib/design/colors';

interface RouteChipProps {
  routeId: string;
  size?: 'sm' | 'md';
}

export function RouteChip({ routeId, size = 'md' }: RouteChipProps) {
  const color = getRouteColor(routeId);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-semibold font-display text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
      aria-label={`Ruta ${routeId}`}
    >
      {routeId}
    </span>
  );
}
