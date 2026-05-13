'use client';

import { MapPin } from 'lucide-react';
import type { NearbyStop } from '@/lib/types';
import { ETABadge } from './ETABadge';

interface StopListItemProps {
  stop: NearbyStop;
  eta?: number; // segundos
  onClick?: () => void;
}

export function StopListItem({ stop, eta, onClick }: StopListItemProps) {
  const distanceLabel =
    stop.distance_km < 1
      ? `${Math.round(stop.distance_km * 1000)} m`
      : `${stop.distance_km.toFixed(1)} km`;

  // Barra proporcional de distancia (0–2km → 0–100%)
  const barPercent = Math.min(100, (stop.distance_km / 2) * 100);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 py-3 px-1 text-left transition-colors hover:bg-[var(--color-bg)] rounded-xl active:scale-[0.99]"
      aria-label={`Parada ${stop.name}, ${distanceLabel}`}
    >
      <div className="mt-1 w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
        <MapPin size={16} className="text-[var(--color-primary)]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
            {stop.name}
          </span>
          {eta !== undefined && <ETABadge seconds={eta} />}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
              style={{ width: `${barPercent}%` }}
            />
          </div>
          <span className="text-xs text-[var(--color-text-secondary)] shrink-0">
            {distanceLabel}
          </span>
        </div>
      </div>
    </button>
  );
}
