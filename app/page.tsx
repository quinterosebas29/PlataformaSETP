import type { Metadata } from 'next';
import { readHomeData } from '@/lib/dataService';
import HolaMundo from '@/components/HolaMundo';

/**
 * Page-level metadata — dynamically sourced from home.json via dataService.
 * This runs on the server, so `readHomeData()` is safe to use here.
 */
export function generateMetadata(): Metadata {
  const homeData = readHomeData();
  return {
    title: homeData.meta.pageTitle,
    description: homeData.meta.description,
  };
}

/**
 * HomePage — Server Component
 *
 * Reads home.json from the filesystem (via readHomeData, which:
 *   1. reads /data/home.json with Node.js fs
 *   2. validates against HomeDataSchema (Zod)
 *   3. returns a fully typed HomeData object)
 *
 * Then passes the validated data as props to HolaMundo (Client Component).
 * The JSON data never reaches the client bundle.
 */
export default function HomePage() {
  // Server-side: read + validate JSON → typed HomeData
  const homeData = readHomeData();

  return (
    <main aria-label="Página de inicio">
      <HolaMundo
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        description={homeData.hero.description}
      />
    </main>
  );
}
