// Colores del design system SETP SM
export const colors = {
  primary: '#0D2B55',
  primaryLight: '#1E4080',
  accent: '#F5C518',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E2E8F0',
  success: '#22C55E',
  warning: '#F97316',
  error: '#EF4444',
  ruta03: '#2563EB',
  ruta11: '#16A34A',
  ruta16: '#DC2626',
  offlineBg: '#FEF3C7',
  offlineText: '#92400E',
} as const;

export type ColorKey = keyof typeof colors;

export function getRouteColor(routeId: string): string {
  const map: Record<string, string> = {
    '03': colors.ruta03,
    '11': colors.ruta11,
    '16': colors.ruta16,
  };
  return map[routeId] ?? colors.primary;
}
