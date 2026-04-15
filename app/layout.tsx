import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, DM_Mono } from 'next/font/google';
import './globals.css';

/* ── Fuente Display: Space Grotesk (distintiva, geométrica, moderna) ── */
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

/* ── Fuente Mono: DM Mono (para subtítulos y badges técnicos) ── */
const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Home | Mi App',
  description: 'Página principal del sistema — Fullstack TypeScript + Next.js + Vercel',
  keywords: ['TypeScript', 'Next.js', 'Vercel', 'Fullstack', 'React'],
  authors: [{ name: 'SETP Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${dmMono.variable} antialiased h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
