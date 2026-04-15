import fs from 'fs';
import path from 'path';
import type { HomeData, AppConfig } from '@/lib/types';
import { HomeDataSchema, AppConfigSchema } from '@/lib/validators';

/**
 * Lee y parsea cualquier archivo JSON ubicado en /data.
 * Esta función SOLO debe usarse en Server Components o Route Handlers.
 * Nunca importar ni llamar desde Client Components.
 *
 * @param filename - Nombre del archivo JSON (ej: 'home.json')
 * @returns El contenido del archivo parseado y tipado como T
 */
export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

// ─────────────────────────────────────────────────────────
// Funciones tipadas con validación Zod integrada
// ─────────────────────────────────────────────────────────

/**
 * Lee /data/home.json, valida con HomeDataSchema (Zod) y retorna HomeData.
 * Lanza ZodError si la estructura del JSON no coincide con el schema.
 *
 * @returns HomeData validado en runtime
 */
export function readHomeData(): HomeData {
  const raw = readJsonFile<HomeData>('home.json');
  return HomeDataSchema.parse(raw);
}

/**
 * Lee /data/config.json, valida con AppConfigSchema (Zod) y retorna AppConfig.
 * Lanza ZodError si la estructura del JSON no coincide con el schema.
 *
 * @returns AppConfig validado en runtime
 */
export function readAppConfig(): AppConfig {
  const raw = readJsonFile<AppConfig>('config.json');
  return AppConfigSchema.parse(raw);
}
