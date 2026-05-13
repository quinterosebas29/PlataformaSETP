import type { Stop } from './types';

/**
 * Interpola linealmente la posición del bus entre la parada actual y la siguiente.
 * @param currentStop Parada en la que está el bus
 * @param nextStop    Próxima parada
 * @param progress    0 = en la parada actual, 1 = en la próxima parada
 */
export function interpolatePosition(
  currentStop: Stop,
  nextStop: Stop,
  progress: number
): { lat: number; lng: number } {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  return {
    lat: currentStop.latitude + (nextStop.latitude - currentStop.latitude) * clampedProgress,
    lng: currentStop.longitude + (nextStop.longitude - currentStop.longitude) * clampedProgress,
  };
}
