'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface DiagnoseResult {
  mode: string;
  migrations: Array<{ filename: string; applied_at: string }>;
  tables: Record<string, number>;
  message?: string;
}

interface BootstrapResult {
  success?: boolean;
  migrations?: Array<{ filename: string; status: string; error?: string }>;
  seed?: Record<string, number>;
  error?: string;
}

export default function DbSetupPage() {
  const [secret, setSecret] = useState('');
  const [diagnose, setDiagnose] = useState<DiagnoseResult | null>(null);
  const [bootstrapResult, setBootstrapResult] = useState<BootstrapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const [error, setError] = useState('');

  async function loadDiagnose() {
    setDiagnosing(true);
    try {
      const res = await fetch('/api/system/diagnose');
      const data = await res.json();
      setDiagnose(data);
    } catch {
      setError('Error al cargar diagnóstico');
    } finally {
      setDiagnosing(false);
    }
  }

  useEffect(() => {
    loadDiagnose();
  }, []);

  async function handleBootstrap() {
    if (!secret) {
      setError('Debes ingresar el secreto de admin');
      return;
    }
    setLoading(true);
    setError('');
    setBootstrapResult(null);

    try {
      const res = await fetch('/api/system/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });
      const data = await res.json();
      setBootstrapResult(data);
      if (data.success) {
        await loadDiagnose();
      }
    } catch {
      setError('Error de red al hacer bootstrap');
    } finally {
      setLoading(false);
    }
  }

  const modeColor = diagnose?.mode === 'live'
    ? 'text-green-600'
    : 'text-amber-600';

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-display text-[var(--color-text-primary)] mb-1">
            🛠️ Configuración de Base de Datos
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            SETP SM — Panel de administración técnica
          </p>
        </div>

        {/* Estado del sistema */}
        <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 mb-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-4">
            Estado del sistema
          </h2>

          {diagnosing ? (
            <p className="text-sm text-[var(--color-text-secondary)]">Cargando diagnóstico…</p>
          ) : diagnose ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">Modo:</span>
                <span className={`text-sm font-semibold ${modeColor}`}>
                  {diagnose.mode.toUpperCase()}
                </span>
              </div>

              {diagnose.message && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  {diagnose.message}
                </p>
              )}

              {diagnose.tables && (
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">Registros:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(diagnose.tables).map(([table, count]) => (
                      <div key={table} className="flex justify-between text-xs bg-[var(--color-bg)] rounded-lg px-3 py-2">
                        <span className="text-[var(--color-text-secondary)]">{table}</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diagnose.migrations?.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                    Migrations aplicadas ({diagnose.migrations.length}):
                  </p>
                  <div className="space-y-1">
                    {diagnose.migrations.map((m) => (
                      <div key={m.filename} className="text-xs flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-[var(--color-text-secondary)]">{m.filename}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* Bootstrap */}
        <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 mb-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-4">
            Aplicar bootstrap
          </h2>

          <div className="space-y-4">
            <Input
              id="bootstrap-secret"
              label="Secreto de admin (ADMIN_BOOTSTRAP_SECRET)"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Ingresa el secreto…"
            />

            {error && (
              <p className="text-xs text-[var(--color-error)]">{error}</p>
            )}

            <Button
              id="btn-bootstrap"
              onClick={handleBootstrap}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Aplicando bootstrap…' : '🚀 Aplicar bootstrap'}
            </Button>
          </div>
        </section>

        {/* Resultado del bootstrap */}
        {bootstrapResult && (
          <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-4">
              Resultado
            </h2>

            {bootstrapResult.error ? (
              <p className="text-sm text-[var(--color-error)]">
                Error: {bootstrapResult.error}
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-green-600 font-semibold">✅ Bootstrap exitoso</p>

                {bootstrapResult.migrations && (
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">Migrations:</p>
                    {bootstrapResult.migrations.map((m) => (
                      <div key={m.filename} className="text-xs flex items-center gap-2">
                        <span className={m.status === 'error' ? 'text-red-500' : 'text-green-500'}>
                          {m.status === 'applied' ? '✓' : m.status === 'already_applied' ? '~' : '✗'}
                        </span>
                        <span className="text-[var(--color-text-secondary)]">
                          {m.filename} — {m.status}
                          {m.error && `: ${m.error}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {bootstrapResult.seed && (
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">Seed cargado:</p>
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(bootstrapResult.seed).map(([k, v]) => (
                        <div key={k} className="text-xs flex justify-between bg-[var(--color-bg)] rounded-lg px-3 py-1.5">
                          <span className="text-[var(--color-text-secondary)]">{k}</span>
                          <span className="font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
