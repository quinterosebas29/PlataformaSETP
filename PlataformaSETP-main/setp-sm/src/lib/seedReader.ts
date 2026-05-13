import seedData from '../../data/seed.json';
import type { Route, Stop } from './types';

export const routes: Route[] = seedData.routes.map((r) => ({
  id: r.id,
  name: r.name,
  color: r.color,
}));

export const stops: Stop[] = seedData.stops.map((s) => ({
  id: s.id,
  name: s.name,
  latitude: s.lat,
  longitude: s.lng,
}));

export const routeStops = seedData.route_stops;

export const buses = seedData.buses;

/** Retorna las paradas de una ruta ordenadas por stop_order */
export function getSeedRouteStops(routeId: string): Stop[] {
  const entries = routeStops
    .filter((rs) => rs.route_id === routeId)
    .sort((a, b) => a.order - b.order);

  return entries
    .map((entry) => stops.find((s) => s.id === entry.stop_id))
    .filter((s): s is Stop => s !== undefined);
}
