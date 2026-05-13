import { redirect } from 'next/navigation';

// app/page.tsx → stub: redirect inmediato a /(tabs)/map
// Stream C (Richard) reemplazará esto con Splash + decisor de onboarding

export default function RootPage() {
  redirect('/map');
}
