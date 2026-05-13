// STUB — Stream C (Richard) implementará la pantalla de Favoritos
// No modificar hasta que Stream C esté en su branch feat/stream-c-discovery

export default function FavoritesPage() {
  return (
    <div className="flex items-center justify-center h-full min-h-[calc(100dvh-var(--bottom-nav-height))] bg-[var(--color-bg)]">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⭐</span>
        </div>
        <h1 className="text-xl font-semibold font-display text-[var(--color-text-primary)] mb-2">
          Rutas favoritas
        </h1>
        <p className="text-[var(--color-text-secondary)] font-body text-sm">
          [Stream C] Pantalla: Favoritos
        </p>
      </div>
    </div>
  );
}
