'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Route, Star } from 'lucide-react';

const tabs = [
  { href: '/(tabs)/map', label: 'Mapa', icon: Map, id: 'tab-map' },
  { href: '/(tabs)/routes', label: 'Rutas', icon: Route, id: 'tab-routes' },
  { href: '/(tabs)/favorites', label: 'Favoritas', icon: Star, id: 'tab-favorites' },
];

// Next.js App Router: las rutas del grupo (tabs) se acceden sin el prefijo (tabs)
const tabPaths = [
  { href: '/map', label: 'Mapa', icon: Map, id: 'tab-map' },
  { href: '/routes', label: 'Rutas', icon: Route, id: 'tab-routes' },
  { href: '/favorites', label: 'Favoritas', icon: Star, id: 'tab-favorites' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-[0_-1px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}
      aria-label="Navegación principal"
    >
      <div className="flex items-stretch" style={{ height: 'var(--bottom-nav-height)' }}>
        {tabPaths.map(({ href, label, icon: Icon, id }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              id={id}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium leading-none ${isActive ? 'font-semibold' : ''}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
