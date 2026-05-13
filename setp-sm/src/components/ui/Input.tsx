'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]
          px-4 py-3 text-[15px] text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-secondary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
          transition-all duration-150
          ${error ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--color-error)]">{error}</span>
      )}
    </div>
  );
}
