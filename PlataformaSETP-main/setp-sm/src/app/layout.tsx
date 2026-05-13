import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SETP SM — Transporte Público Santa Marta',
  description:
    'Consulta en tiempo real la posición de los buses del Sistema Estratégico de Transporte Público de Santa Marta. Rutas 03, 11 y 16.',
  keywords: ['SETP', 'Santa Marta', 'transporte público', 'buses', 'tiempo real'],
  authors: [
    { name: 'Pedro José Jiménez' },
    { name: 'Sebastián Quintero' },
    { name: 'Richard Díaz' },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0D2B55',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
