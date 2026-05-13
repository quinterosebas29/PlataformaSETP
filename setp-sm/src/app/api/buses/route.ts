import { NextResponse } from 'next/server';
import { getActiveBuses } from '@/lib/dataService';

export async function GET() {
  const buses = await getActiveBuses();
  return NextResponse.json(buses);
}
