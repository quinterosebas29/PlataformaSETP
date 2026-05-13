import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase', 'migrations');

export interface MigrationResult {
  filename: string;
  status: 'applied' | 'already_applied' | 'error';
  error?: string;
}

export async function applyMigrations(): Promise<MigrationResult[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const results: MigrationResult[] = [];

  try {
    // Crear tabla de migrations si no existe (bootstrap de la tabla de bootstrap)
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id         SERIAL       PRIMARY KEY,
        filename   VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    // Leer archivos de migración en orden
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const filename of files) {
      // Verificar si ya fue aplicada
      const { rows } = await client.query(
        'SELECT id FROM _migrations WHERE filename = $1',
        [filename]
      );

      if (rows.length > 0) {
        results.push({ filename, status: 'already_applied' });
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, filename), 'utf8');

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO _migrations (filename) VALUES ($1)',
          [filename]
        );
        await client.query('COMMIT');
        results.push({ filename, status: 'applied' });
      } catch (err) {
        await client.query('ROLLBACK');
        const error = err instanceof Error ? err.message : String(err);
        results.push({ filename, status: 'error', error });
      }
    }
  } finally {
    await client.end();
  }

  return results;
}

export async function applySeed(): Promise<{ routes: number; stops: number; route_stops: number; buses: number }> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  const seed = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'seed.json'), 'utf8')
  );

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    // Routes
    for (const route of seed.routes) {
      await client.query(
        `INSERT INTO routes (id, name, color) VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [route.id, route.name, route.color]
      );
    }

    // Stops
    for (const stop of seed.stops) {
      await client.query(
        `INSERT INTO stops (id, name, latitude, longitude) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [stop.id, stop.name, stop.lat, stop.lng]
      );
    }

    // Route stops
    for (const rs of seed.route_stops) {
      await client.query(
        `INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES ($1, $2, $3)
         ON CONFLICT (route_id, stop_id) DO NOTHING`,
        [rs.route_id, rs.stop_id, rs.order]
      );
    }

    // Buses
    for (const bus of seed.buses) {
      await client.query(
        `INSERT INTO buses (id, route_id, current_stop_index, eta_to_next_stop_seconds, status)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [bus.id, bus.route_id, bus.current_stop_index, bus.eta_to_next_stop_seconds, bus.status]
      );
    }

    return {
      routes: seed.routes.length,
      stops: seed.stops.length,
      route_stops: seed.route_stops.length,
      buses: seed.buses.length,
    };
  } finally {
    await client.end();
  }
}
