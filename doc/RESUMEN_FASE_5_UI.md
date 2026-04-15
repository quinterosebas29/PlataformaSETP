# 🟣 RESUMEN FASE 5 — UI / Home — Hola Mundo
> Fecha de ejecución: 2026-04-08 / 2026-04-09 | Rol: Diseñador UX/UI Senior + Ingeniero Frontend

---

## 🎯 Objetivo

Diseñar e implementar la página de inicio del sistema como una experiencia visual de alta calidad que valide el funcionamiento completo del stack TypeScript + Next.js + Framer Motion. El "Hola Mundo" debía ser visualmente impactante, completamente animado y servir como prueba de integración end-to-end del pipeline de datos (JSON → Server Component → Client Component).

---

## 🎨 Brief de Diseño — Decisiones Tomadas

### Paleta de Colores
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#050510` | Fondo Deep Space (casi negro azulado) |
| `--color-accent-1` | `hsl(258, 100%, 68%)` | Violet eléctrico — glow principal, underline |
| `--color-accent-2` | `hsl(185, 100%, 58%)` | Cyan Glow — badge, outlines |
| `--color-accent-3` | `hsl(310, 85%, 65%)` | Magenta suave — orbe 3 |
| `--color-text-primary` | `rgba(255,255,255,0.95)` | Texto principal |
| `--color-text-secondary` | `rgba(255,255,255,0.45)` | Subtítulo |
| `--color-text-muted` | `rgba(255,255,255,0.22)` | Descripción, líneas ornamentales |

**Justificación:** El negro puro (#000) es demasiado plano. El `#050510` con un leve matiz azul da profundidad espacial. Los acentos en espacio de color HSL permiten ajustar luminosidad con precisión sin perder saturación.

### Tipografía
| Familia | Fuente | Uso | Carga |
|---------|--------|-----|-------|
| Display | **Space Grotesk** (Google Fonts, 700) | Título principal, body | Next/Font (auto-optimizado) |
| Mono | **DM Mono** (Google Fonts, 400/500) | Subtítulo, badges, eyebrow | Next/Font (auto-optimizado) |

**Por qué Space Grotesk:** Tipografía geométrica con irregularidades sutiles que la hacen más "humana" que Inter, pero más moderna y técnica que otras display fonts. Ideal para tech products.
**Por qué DM Mono:** Diseñada para ser legible a tamaños pequeños y en interfaces técnicas. Mejor alternativa a JetBrains Mono para contextos de UI.

### Tipo de Animación
- **Técnica elegida:** Per-letter stagger con `opacity + translateY` — cada carácter entra individualmente con 60ms de separación entre letras (stagger).
- **Por qué no typewriter:** El efecto cursor parpadea, se ve "retro". El stagger de letras es más elegante y contemporáneo.
- **Ease:** `cubic-bezier(0.22, 1, 0.36, 1)` — spring natural que sube rápido y se asienta suavemente.

### Elementos Decorativos
1. **3 orbes de glow ambiental** — radial gradients con `blur(120px)`, animados con CSS `@keyframes float-orb` (±30px Y, 8s loop infinite).
2. **Grid overlay** — `background-image` con lineas de 1px, enmascarado con `mask-image: radial-gradient` para que sea visible en el centro y se desvanezca en los bordes.
3. **Eyebrow badge** — pastilla glassmorphism con `backdrop-filter: blur(8px)`, dot pulsante (CSS keyframes), tipografía mono uppercase.
4. **Glowing underline** — línea H2px con gradiente `transparent → violet → cyan → transparent` y `box-shadow` para el efecto de halo.
5. **Tech stack badges** — `whileHover: scale(1.09), y(-3)` de Framer Motion para micro-interacción de elevación.
6. **Bottom ornamental line** — estructura de segmentos + dot central con glow puntual.

### Responsive
- Tipografía fluida con `clamp()`: `clamp(3.5rem, 12vw, 9rem)` para el título, escala en todos los viewports.
- Badges envuelven con `flex-wrap: wrap` en mobile.
- Grid overlay ajusta densidad: `60px` desktop → `40px` mobile (`< 480px`).
- Orbes usan `min(600px, 80vw)` para no sobrepasar viewport en mobile.

---

## 🧩 Componentes Creados

### `/components/AnimatedText.tsx`

```tsx
'use client';

import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const letterVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function AnimatedText({
  text,
  delay = 0,
  className,
}: AnimatedTextProps) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={i}
          variants={letterVariants}
          className="inline-block"
          style={{ animationDelay: `${delay}s` }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
```

**Características clave:**
- `custom={i}` pasa el índice a las variantes para calcular el delay por letra.
- `aria-label={text}` en el contenedor + `aria-hidden="true"` en las spans individuales → accesibilidad correcta.
- El carácter espacio se convierte en `\u00A0` (non-breaking space) para que `inline-block` lo respete.

---

### `/components/HolaMundo.tsx`

**Arquitectura:** Full-screen hero section con timing orquestado. Recibe 3 props desde el Server Component: `title`, `subtitle`, `description`.

**Timing chain:**
```
0.1s  → eyebrow badge (fade + slide-up + scale)
0.2s  → inicio de AnimatedText (letra a letra, 0.06s stagger)
~1.4s → glowing underline (scaleX 0→1)
~1.7s → subtitle (blur 8px→0 + fade-up)
~2.2s → description (fade-up)
~2.6s → tech badges (stagger per-badge 0.08s)
~3.2s → bottom ornamental line (fade-in)
```

**Elementos:** Ambient orbs (CSS), grid overlay, eyebrow badge, h1+AnimatedText, glowing underline, subtitle, description, tech badges con hover, bottom line.

---

### `/app/page.tsx` — Server Component

```tsx
import type { Metadata } from 'next';
import { readHomeData } from '@/lib/dataService';
import HolaMundo from '@/components/HolaMundo';

export function generateMetadata(): Metadata {
  const homeData = readHomeData();
  return {
    title: homeData.meta.pageTitle,
    description: homeData.meta.description,
  };
}

export default function HomePage() {
  const homeData = readHomeData(); // → lee, valida con Zod, retorna HomeData tipado
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
```

---

### `/app/layout.tsx` — Global Layout

```tsx
import { Space_Grotesk, DM_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
});
```

Configura las variables CSS de fuentes para que `globals.css` las pueda consumir con `var(--font-space-grotesk)`.

---

### `/app/globals.css` — Sistema de Diseño

**392 líneas** que incluyen:
- **Design tokens** (CSS custom properties): colores, fuentes, espaciados, radios, glows, easings.
- **Reset CSS** con box-sizing inherit y smoothing.
- **Layouts**: `.page-root`, `.hola-mundo-container`, `.content-wrapper`.
- **Ambient orbs**: `.ambient-glow`, `.ambient-glow-1/2/3` + `@keyframes float-orb`.
- **Grid overlay**: con `mask-image` radial.
- **Componentes de UI**: `.eyebrow-badge`, `.badge-dot`, `.main-title`, `.title-text`, `.title-underline`, `.subtitle`, `.description`, `.tech-badges`, `.tech-badge`, `.bottom-line`.
- **Animaciones**: `@keyframes pulse-dot`, `@keyframes float-orb`.
- **Responsive**: breakpoints `@media (max-width: 480px)` y `@media (min-width: 1400px)`.
- **Tailwind bridge**: `@theme inline` para integración con Tailwind v4.

**Decisión técnica importante:** El `background-clip: text` (gradient text) se aplica en `.title-text .inline-block` (las spans individuales) y NO en el `<h1>` padre. Esto es necesario porque Framer Motion crea stacking contexts con `opacity` y `transform` que rompen `background-clip` cuando se aplica en un ancestro.

---

## 📊 Resultado de `npm run typecheck`

```
> setp-app@0.1.0 typecheck
> tsc --noEmit

Exit code: 0 ✅ (sin errores)
```

---

## 🖼️ Descripción Visual de la Pantalla Resultante

```
┌─────────────────────────────────────────────────────────┐
│  [fondo deep-space #050510 con 3 orbes de glow flotantes]│
│                                                          │
│  ┌──── grid overlay ─── desvanece en bordes ────┐        │
│  │                                              │        │
│  │   ● Sistema Fullstack TypeScript  ← badge   │        │
│  │                                              │        │
│  │   H o l a   M u n d o             ← h1      │        │
│  │   ─────────────────── ← glowing underline   │        │
│  │   TYPESCRIPT + NEXT.JS + VERCEL  ← subtitle │        │
│  │   Sistema fullstack funcionando   ← desc     │        │
│  │                                              │        │
│  │  [Next.js] [TypeScript] [Motion] [Zod] [▲] │        │
│  │                                              │        │
│  │           ───  ●  ───   ← ornamental        │        │
│  └──────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

- El título aparece letra a letra con gradient blanco→violeta→cyan.
- La línea bajo el título emite un halo violeta-cyan (`box-shadow`).
- Los badges de tech responden al hover con elevación animada.
- El pulsing dot del badge parpadea suavemente (0.5 scale, 2s loop).

---

## ✅ Estado Final

**EXITOSO**

- `npm run typecheck` → ✅ 0 errores
- Todos los componentes completamente tipados en TypeScript
- Patrón Server Component → Client Component respetado (sin `any`)
- Datos JSON nunca expuestos al cliente
- SEO: metadata dinámica generada desde `home.json`
- Accesibilidad: `aria-label` en h1, `role="status"` en badge, `role="list"` en badges

---

## 🚀 Próxima Fase

**Fase 6 — Pipeline CI/CD** — Configuración de GitHub Actions + vinculación con Vercel para despliegue continuo automático.
