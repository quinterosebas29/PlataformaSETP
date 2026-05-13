// STUB — Stream A (Pedro) implementará la pantalla del Mapa Principal
// No modificar hasta que Stream A esté en su branch feat/stream-a-mapa

export default function MapPage() {
  return (
    <div className="flex items-center justify-center h-full min-h-[calc(100dvh-var(--bottom-nav-height))] bg-[var(--color-bg)]">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🗺️</span>
        </div>
        <h1 className="text-xl font-semibold font-display text-[var(--color-text-primary)] mb-2">
          Mapa en tiempo real
        </h1>
        <p className="text-[var(--color-text-secondary)] font-body text-sm">
          [Stream A] Pantalla: Mapa Principal
        </p>
      </div>
    </div>
  );
}
