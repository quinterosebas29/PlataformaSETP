import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { getSystemMode } from '@/lib/dataService';

export async function GET() {
  const mode = await getSystemMode();

  if (!supabase || mode === 'seed') {
    return NextResponse.json({
      mode: 'seed',
      migrations: [],
      tables: { routes: 0, stops: 0, buses: 0, favorites: 0 },
      message: 'Running in seed mode — Supabase not configured',
    });
  }

  try {
    // Migrations aplicadas
    const { data: migrations } = await supabase
      .from('_migrations')
      .select('*')
      .order('applied_at');

    // Conteos
    const [
      { count: routesCount },
      { count: stopsCount },
      { count: busesCount },
      { count: favoritesCount },
    ] = await Promise.all([
      supabase.from('routes').select('*', { count: 'exact', head: true }),
      supabase.from('stops').select('*', { count: 'exact', head: true }),
      supabase.from('buses').select('*', { count: 'exact', head: true }),
      supabase.from('favorites').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      mode: 'live',
      migrations: migrations ?? [],
      tables: {
        routes: routesCount ?? 0,
        stops: stopsCount ?? 0,
        buses: busesCount ?? 0,
        favorites: favoritesCount ?? 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
