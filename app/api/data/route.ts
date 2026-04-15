import { NextResponse } from 'next/server';
import { readHomeData } from '@/lib/dataService';

export async function GET() {
  try {
    const data = readHomeData();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in /api/data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Error al leer o validar datos del home' },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
