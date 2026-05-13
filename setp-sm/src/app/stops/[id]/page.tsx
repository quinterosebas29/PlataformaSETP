// STUB — Stream C (Richard) implementará el Detalle de Parada
export default function StopDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
      <p className="text-[var(--color-text-secondary)] text-sm">
        [Stream C] Pantalla: Detalle de parada {params.id}
      </p>
    </div>
  );
}
