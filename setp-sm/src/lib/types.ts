// Tipos compartidos del sistema SETP SM

export interface Route {
  id: string;
  name: string;
  color: string;
}

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface RouteStop {
  route_id: string;
  stop_id: string;
  stop_order: number;
}

export interface Bus {
  id: string;
  route_id: string;
  current_stop_index: number;
  eta_to_next_stop_seconds: number;
  status: 'en_ruta' | 'demorado' | 'fuera_de_servicio';
  current_lat: number | null;
  current_lng: number | null;
  updated_at: string;
}

export interface BusWithRoute extends Bus {
  route: Route;
}

export interface NearbyStop extends Stop {
  distance_km: number;
}

export interface Favorite {
  id: string;
  device_id: string;
  route_id: string;
  saved_at: string;
}

export interface MigrationRecord {
  id: number;
  filename: string;
  applied_at: string;
}

export interface SystemDiagnose {
  mode: 'seed' | 'live';
  migrations: MigrationRecord[];
  counts: {
    routes: number;
    stops: number;
    buses: number;
  };
}
