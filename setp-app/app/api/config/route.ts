import { NextResponse } from 'next/server';
import { readAppConfig } from '@/lib/dataService';

export async function GET() {
  try {
    const data = readAppConfig();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in /api/config:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Error al leer o validar configuración' },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
