import supabase from './supabase';
import { routes as seedRoutes, stops as seedStops, buses as seedBuses, getSeedRouteStops } from './seedReader';
import { interpolatePosition } from './busSimulation';
import type { Route, Stop, Bus, BusWithRoute, NearbyStop, Favorite } from './types';

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Distancia haversine en km entre dos puntos geográficos */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Sistema ────────────────────────────────────────────────────────────────

export async function getSystemMode(): Promise<'seed' | 'live'> {
  if (!supabase) return 'seed';
  try {
    const { error } = await supabase.from('routes').select('id').limit(1);
    return error ? 'seed' : 'live';
  } catch {
    return 'seed';
  }
}

// ─── Catálogo ───────────────────────────────────────────────────────────────

export async function getRoutes(): Promise<Route[]> {
  if (!supabase) return seedRoutes;
  const { data, error } = await supabase.from('routes').select('*').order('id');
  if (error || !data) return seedRoutes;
  return data as Route[];
}

export async function getStops(): Promise<Stop[]> {
  if (!supabase) return seedStops;
  const { data, error } = await supabase.from('stops').select('*').order('id');
  if (error || !data) return seedStops;
  return data as Stop[];
}

export async function getRouteStops(routeId: string): Promise<Stop[]> {
  if (!supabase) return getSeedRouteStops(routeId);

  const { data, error } = await supabase
    .from('route_stops')
    .select('stop_id, stop_order, stops(*)')
    .eq('route_id', routeId)
    .order('stop_order');

  if (error || !data) return getSeedRouteStops(routeId);

  return data
    .map((rs: any) => rs.stops)
    .filter(Boolean) as Stop[];
}

export async function getNearbyStops(
  lat: number,
  lng: number,
  limit: number = 10
): Promise<NearbyStop[]> {
  const allStops = await getStops();
  return allStops
    .map((stop) => ({
      ...stop,
      distance_km: haversineKm(lat, lng, stop.latitude, stop.longitude),
    }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);
}

// ─── Buses ──────────────────────────────────────────────────────────────────

export async function getActiveBuses(): Promise<Bus[]> {
  if (!supabase) {
    return seedBuses
      .filter((b) => b.status !== 'fuera_de_servicio')
      .map((b) => ({
        ...b,
        status: b.status as Bus['status'],
        current_lat: null,
        current_lng: null,
        updated_at: new Date().toISOString(),
      }));
  }

  const { data, error } = await supabase
    .from('buses')
    .select('*')
    .neq('status', 'fuera_de_servicio');

  if (error || !data) return [];
  return data as Bus[];
}

export async function getBusById(id: string): Promise<BusWithRoute | null> {
  if (!supabase) {
    const bus = seedBuses.find((b) => b.id === id);
    if (!bus) return null;
    const route = seedRoutes.find((r) => r.id === bus.route_id);
    if (!route) return null;
    return {
      ...bus,
      status: bus.status as Bus['status'],
      current_lat: null,
      current_lng: null,
      updated_at: new Date().toISOString(),
      route,
    };
  }

  const { data, error } = await supabase
    .from('buses')
    .select('*, routes(*)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return {
    ...data,
    route: data.routes,
  } as BusWithRoute;
}

// ─── Favoritos ──────────────────────────────────────────────────────────────

export async function getFavorites(deviceId: string): Promise<Route[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('favorites')
    .select('routes(*)')
    .eq('device_id', deviceId);

  if (error || !data) return [];
  return data.map((f: any) => f.routes).filter(Boolean) as Route[];
}

export async function addFavorite(deviceId: string, routeId: string): Promise<Favorite> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('favorites')
    .insert({ device_id: deviceId, route_id: routeId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Favorite;
}

export async function removeFavorite(deviceId: string, routeId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('device_id', deviceId)
    .eq('route_id', routeId);

  if (error) throw new Error(error.message);
}

// ─── Simulación de buses ─────────────────────────────────────────────────────

const SECONDS_PER_TICK = 60;        // el cron corre cada 60 segundos
const SECONDS_BETWEEN_STOPS = 300;  // 5 minutos entre paradas

export async function simulateBusesTick(): Promise<{ updated: number }> {
  if (!supabase) throw new Error('Supabase not configured — cannot simulate buses');

  const buses = await getActiveBuses();
  let updatedCount = 0;

  for (const bus of buses) {
    const route = await getRouteStops(bus.route_id);
    if (route.length === 0) continue;

    let newStopIndex = bus.current_stop_index;
    let newEta = bus.eta_to_next_stop_seconds - SECONDS_PER_TICK;

    if (newEta <= 0) {
      // El bus llegó a la próxima parada → avanza
      newStopIndex = (newStopIndex + 1) % route.length;
      newEta = SECONDS_BETWEEN_STOPS;
    }

    const currentStop = route[newStopIndex];
    const nextStop = route[(newStopIndex + 1) % route.length];
    const progress = 1 - newEta / SECONDS_BETWEEN_STOPS;
    const { lat, lng } = interpolatePosition(currentStop, nextStop, progress);

    const { error } = await supabase.from('buses').update({
      current_stop_index: newStopIndex,
      eta_to_next_stop_seconds: Math.max(0, newEta),
      current_lat: lat,
      current_lng: lng,
      updated_at: new Date().toISOString(),
    }).eq('id', bus.id);

    if (!error) updatedCount++;
  }

  return { updated: updatedCount };
}
