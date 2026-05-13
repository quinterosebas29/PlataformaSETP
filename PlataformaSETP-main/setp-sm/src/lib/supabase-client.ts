'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Cliente browser para suscripciones Realtime y queries del lado del cliente
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Singleton para uso en hooks
let _client: ReturnType<typeof createClient> | null = null;

export function getBrowserClient() {
  if (!_client && supabaseUrl && supabaseAnonKey) {
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}
