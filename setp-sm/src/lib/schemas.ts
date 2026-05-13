import { z } from 'zod';

export const RouteSchema = z.object({
  id: z.string().max(5),
  name: z.string().max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const StopSchema = z.object({
  id: z.string().max(10),
  name: z.string().max(150),
  latitude: z.number(),
  longitude: z.number(),
});

export const BusStatusSchema = z.enum(['en_ruta', 'demorado', 'fuera_de_servicio']);

export const BusSchema = z.object({
  id: z.string().max(10),
  route_id: z.string().max(5),
  current_stop_index: z.number().int().min(0),
  eta_to_next_stop_seconds: z.number().int().min(0),
  status: BusStatusSchema,
  current_lat: z.number().nullable(),
  current_lng: z.number().nullable(),
  updated_at: z.string(),
});

export const AddFavoriteSchema = z.object({
  deviceId: z.string().min(1).max(64),
  routeId: z.string().max(5),
});

export const BootstrapSchema = z.object({
  secret: z.string().min(1),
});

export const NearbyStopsQuerySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
