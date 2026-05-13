import { NextResponse } from 'next/server';
import { applyMigrations, applySeed } from '@/lib/pgMigrate';
import { BootstrapSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = BootstrapSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (parsed.data.secret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Aplicar migrations
    const migrations = await applyMigrations();

    // Aplicar seed
    const seedCounts = await applySeed();

    return NextResponse.json({
      success: true,
      migrations,
      seed: seedCounts,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
