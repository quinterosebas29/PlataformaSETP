import { NextResponse } from 'next/server';
import { getStops } from '@/lib/dataService';

export async function GET() {
  const stops = await getStops();
  return NextResponse.json(stops);
}
