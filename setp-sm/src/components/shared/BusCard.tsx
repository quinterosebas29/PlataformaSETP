'use client';

import { Bus } from 'lucide-react';
import type { BusWithRoute } from '@/lib/types';
import { RouteChip } from './RouteChip';
import { ETABadge } from './ETABadge';

interface BusCardProps {
  bus: BusWithRoute;
  onClick?: () => void;
}

export function BusCard({ bus, onClick }: BusCardProps) {
  const statusLabel = {
    en_ruta: 'En ruta',
    demorado: 'Demorado',
    fuera_de_servicio: 'Fuera de servicio',
  }[bus.status];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-left transition-all duration-150 hover:border-[var(--color-primary)] hover:shadow-sm active:scale-[0.98]"
      aria-label={`Bus ${bus.id} Ruta ${bus.route_id}`}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: bus.route.color + '20' }}
      >
        <Bus size={20} style={{ color: bus.route.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <RouteChip routeId={bus.route_id} size="sm" />
          <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
            {bus.route.name}
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-secondary)]">{statusLabel}</span>
      </div>

      <ETABadge seconds={bus.eta_to_next_stop_seconds} />
    </button>
  );
}
