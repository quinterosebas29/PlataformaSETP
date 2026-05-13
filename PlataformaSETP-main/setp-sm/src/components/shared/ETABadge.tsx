'use client';

interface ETABadgeProps {
  seconds: number;
}

export function ETABadge({ seconds }: ETABadgeProps) {
  const minutes = Math.ceil(seconds / 60);

  let colorClass = 'bg-[var(--color-success)] text-white';
  if (minutes > 10) {
    colorClass = 'bg-[var(--color-warning)] text-white';
  } else if (minutes > 5) {
    colorClass = 'bg-[var(--color-accent)] text-[var(--color-text-primary)]';
  }

  const label = minutes <= 1 ? 'Llegando' : `${minutes} min`;

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${colorClass}`}
      aria-label={`ETA: ${label}`}
    >
      {label}
    </span>
  );
}
