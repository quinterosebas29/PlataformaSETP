# Plan de Implementación por Fases — Fullstack TypeScript + Vercel + JSON Data Layer

> **Proyecto:** Sistema Fullstack TypeScript  
> **Basado en:** Plan de Infraestructura v1.0.0  
> **Fecha:** Marzo 2026  
> **Stack:** Next.js 14+ · TypeScript 5 · Vercel · GitHub · JSON File System

---

## Resumen Ejecutivo

Este plan descompone la implementación del sistema fullstack en **6 fases secuenciales**, cada una con objetivos claros, tareas específicas, entregables verificables y criterios de aceptación. Las fases están diseñadas para avanzar de forma incremental: cada fase produce un resultado funcional y verificable antes de pasar a la siguiente.

### Mapa de Fases

| Fase | Nombre | Duración Estimada | Dependencia |
|------|--------|-------------------|-------------|
| 1 | Inicialización del Repositorio y Scaffolding | 1 día | — |
| 2 | Capa de Datos JSON | 0.5 días | Fase 1 |
| 3 | Componentes UI y Home | 0.5 días | Fase 2 |
| 4 | API Routes y Validación Local | 0.5 días | Fase 3 |
| 5 | Pipeline CI/CD (GitHub Actions + Vercel) | 1 día | Fase 4 |
| 6 | Validación en Producción y Cierre | 0.5 días | Fase 5 |

**Duración total estimada:** 4 días hábiles

---

## Fase 1 — Inicialización del Repositorio y Scaffolding

### Objetivo

Tener el repositorio creado en GitHub con el proyecto Next.js inicializado, la estructura de carpetas definida según el plan de arquitectura, y las configuraciones base de TypeScript, ESLint y Prettier funcionando.

### Tareas

#### 1.1 Crear repositorio en GitHub

- Crear repositorio (público o privado según decisión del equipo).
- Definir rama principal: `main`.
- Agregar `.gitignore` base para Next.js/Node.
- Agregar `README.md` inicial con descripción del proyecto.

#### 1.2 Inicializar proyecto Next.js

```bash
npx create-next-app@latest . --typescript --eslint --app --src-dir no
```

- Confirmar que se genera con App Router activado.
- Confirmar que TypeScript está habilitado por defecto.

#### 1.3 Crear estructura de carpetas

Crear manualmente las carpetas y archivos placeholder que no genera el scaffolding:

```
components/
├── ui/                    (vacía, se llenará en Fase 3)
└── layout/                (vacía, se llenará en Fase 3)

data/
├── README.md              (documentación del esquema de datos)
└── config.json            (se creará en Fase 2)

lib/
├── db/
│   ├── index.ts           (exportaciones centrales — placeholder)
│   ├── reader.ts          (se implementará en Fase 2)
│   └── types.ts           (se implementará en Fase 2)
└── utils/
    └── cn.ts              (utilidad de clases CSS condicionales)

types/
└── index.ts               (tipos globales — placeholder)
```

#### 1.4 Configurar TypeScript estricto

Verificar/ajustar `tsconfig.json` con las opciones del plan:

- `"strict": true`
- `"noEmit": true`
- `"resolveJsonModule": true`
- Path aliases: `"@/*": ["./*"]`

#### 1.5 Configurar `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};
```

#### 1.6 Configurar `package.json` scripts

Agregar los scripts adicionales al `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "validate": "npm run type-check && npm run lint"
  }
}
```

#### 1.7 Configurar variables de entorno

- Crear `.env.example` con las variables template (se sube al repo).
- Crear `.env.local` con valores de desarrollo (NO se sube al repo).
- Verificar que `.env.local` está en `.gitignore`.

#### 1.8 Instalar dependencias de desarrollo adicionales

```bash
npm install -D prettier
```

### Entregables

- [ ] Repositorio en GitHub con estructura de carpetas completa.
- [ ] `tsconfig.json` con `strict: true` y path aliases configurados.
- [ ] `next.config.ts` con errores de TS y ESLint bloqueando el build.
- [ ] Scripts `type-check`, `format` y `validate` operativos.
- [ ] `.env.example` y `.env.local` creados.

### Criterio de aceptación

```bash
npm run type-check   # ✅ Sin errores
npm run lint         # ✅ Sin errores
npm run dev          # ✅ Levanta en localhost:3000 (página default de Next.js)
```

---

## Fase 2 — Capa de Datos JSON

### Objetivo

Implementar la capa de persistencia basada en archivos JSON dentro de `/data`, con tipos TypeScript, el cliente de lectura, y el archivo de configuración inicial del proyecto.

### Tareas

#### 2.1 Crear el archivo de datos inicial

Crear `data/config.json`:

```json
{
  "app": {
    "name": "Mi Proyecto Fullstack",
    "version": "1.0.0",
    "locale": "es-CO",
    "greeting": "Hola Mundo"
  },
  "meta": {
    "createdAt": "2026-03-25",
    "updatedAt": "2026-03-25"
  }
}
```

#### 2.2 Documentar el esquema de datos

Crear `data/README.md` describiendo:

- Filosofía de la capa de datos (JSON como base de datos plana).
- Convenciones de nomenclatura (kebab-case para archivos JSON).
- Estructura de cada archivo y su propósito.
- Limitación de Vercel: filesystem efímero, solo lectura en funciones serverless.

#### 2.3 Definir tipos TypeScript

Implementar `lib/db/types.ts`:

```typescript
export interface AppConfig {
  app: {
    name: string;
    version: string;
    locale: string;
    greeting: string;
  };
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}
```

#### 2.4 Implementar el cliente de lectura

Implementar `lib/db/reader.ts`:

```typescript
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}
```

#### 2.5 Configurar exportaciones centrales

Implementar `lib/db/index.ts`:

```typescript
export { readJSON } from './reader';
export type { AppConfig } from './types';
```

### Entregables

- [ ] `data/config.json` con datos iniciales válidos.
- [ ] `data/README.md` con documentación del esquema.
- [ ] `lib/db/types.ts` con interface `AppConfig`.
- [ ] `lib/db/reader.ts` con función genérica `readJSON<T>`.
- [ ] `lib/db/index.ts` con re-exportaciones.

### Criterio de aceptación

```bash
npm run type-check   # ✅ Sin errores (tipos de datos compilan correctamente)
```

Verificación manual: importar `readJSON<AppConfig>('config')` en un archivo temporal y confirmar que TypeScript infiere los tipos correctamente (autocompletado de `app.name`, `meta.createdAt`, etc.).

---

## Fase 3 — Componentes UI y Home

### Objetivo

Implementar la página principal con el componente `HolaMundo`, los estilos globales con la estética luxury minimalista, y el layout raíz de la aplicación. El Home debe mostrar "Hola Mundo" leído desde el JSON con la animación de aparición gradual.

### Tareas

#### 3.1 Implementar estilos globales

Reemplazar `app/globals.css` con:

- Import de Google Fonts: Cormorant Garamond (display) y Montserrat (body).
- Variables CSS: `--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--color-muted`, `--font-display`, `--font-body`.
- Reset CSS: box-sizing, margin, padding.
- Keyframes: `fadeSlideUp`, `shimmer`, `lineExpand`.

#### 3.2 Implementar componente `HolaMundo`

Crear `components/ui/HolaMundo.tsx`:

- Directiva `'use client'` (usa animaciones CSS vía estilos inline).
- Interface `HolaMundoProps` con prop `greeting` opcional (default: `'Hola Mundo'`).
- Layout: sección flex centrada verticalmente, full viewport height.
- Elementos: subtítulo del stack, heading con el greeting, línea decorativa, texto "Sistema operativo ✓".
- Animaciones escalonadas con delay progresivo.

#### 3.3 Implementar layout raíz

Actualizar `app/layout.tsx`:

- Metadatos: título y descripción del proyecto.
- Import de `globals.css`.
- HTML con `lang="es"`.

#### 3.4 Implementar página Home

Actualizar `app/page.tsx`:

- Server Component (sin `'use client'`).
- Leer `config.json` usando `readJSON<AppConfig>('config')`.
- Renderizar `<HolaMundo greeting={config.app.greeting} />`.

### Entregables

- [ ] `app/globals.css` con variables, reset y keyframes.
- [ ] `components/ui/HolaMundo.tsx` con animación y tipado.
- [ ] `app/layout.tsx` con metadatos y estilos globales.
- [ ] `app/page.tsx` leyendo datos del JSON y renderizando el componente.

### Criterio de aceptación

```bash
npm run dev          # ✅ Levanta sin errores
npm run type-check   # ✅ Sin errores de tipos
```

Verificación visual en `localhost:3000`:

- [ ] "Hola Mundo" visible y centrado en pantalla.
- [ ] Animación de aparición gradual (`fade-in + slide-up`) ejecutándose.
- [ ] Tipografía serif refinada (Cormorant Garamond) en el heading.
- [ ] Paleta monocromática con acento dorado visible.
- [ ] Texto del saludo proviene del archivo `data/config.json`.

---

## Fase 4 — API Routes y Validación Local Completa

### Objetivo

Implementar la API Route de ejemplo que expone los datos JSON vía HTTP, ejecutar la validación completa del sistema en entorno local (type-check, lint, build), y confirmar que la cadena de tipos TypeScript funciona end-to-end.

### Tareas

#### 4.1 Implementar API Route

Crear `app/api/data/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/db/reader';
import type { AppConfig } from '@/lib/db/types';

export async function GET() {
  const config = readJSON<AppConfig>('config');
  return NextResponse.json(config);
}
```

#### 4.2 Verificar respuesta de la API

Con el servidor de desarrollo corriendo:

```bash
curl http://localhost:3000/api/data
```

Respuesta esperada: el contenido de `data/config.json` como JSON con headers correctos.

#### 4.3 Ejecutar validación completa

```bash
npm run type-check    # Verificación de tipos
npm run lint          # Verificación de estilo
npm run build         # Build de producción
```

Los tres comandos deben pasar sin errores ni warnings.

#### 4.4 Validar cadena de tipos end-to-end

Confirmar que la cadena de tipado funciona completamente:

```
data/config.json
  → readJSON<AppConfig>()        ← tipos verificados en lib/db/reader.ts
  → app/page.tsx                 ← Server Component con tipos verificados
  → <HolaMundo greeting={...} /> ← Props tipadas con HolaMundoProps
  → Renderizado en navegador     ← Sistema de tipos validado
```

#### 4.5 Implementar utilidad de clases CSS (opcional)

Crear `lib/utils/cn.ts` si se planea usar clases CSS condicionales:

```typescript
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

### Entregables

- [ ] `app/api/data/route.ts` funcional y tipado.
- [ ] `GET /api/data` retorna JSON con estructura correcta.
- [ ] `npm run type-check` — sin errores.
- [ ] `npm run lint` — sin errores.
- [ ] `npm run build` — build exitoso.

### Criterio de aceptación

| Verificación | Resultado |
|---|---|
| `tsc --noEmit` | ✅ Sin errores |
| `next build` | ✅ Build exitoso |
| `GET /api/data` | ✅ Retorna JSON tipado |
| Home en `localhost:3000` | ✅ "Hola Mundo" visible con animación |

---

## Fase 5 — Pipeline CI/CD (GitHub Actions + Vercel)

### Objetivo

Configurar la integración continua con GitHub Actions para validar TypeScript, lint y build en cada push, y conectar el repositorio a Vercel para despliegues automáticos en producción (`main`) y preview (ramas de feature).

### Tareas

#### 5.1 Crear workflow de GitHub Actions

Crear `.github/workflows/ci.yml`:

```yaml
name: CI — TypeScript Validation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Validate TypeScript & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
```

#### 5.2 Hacer push y verificar Actions

```bash
git add .
git commit -m "feat: configurar pipeline CI con GitHub Actions"
git push origin main
```

- Ir a GitHub → Actions → verificar que el job `validate` pase con ✅.

#### 5.3 Conectar repositorio a Vercel

1. Ir a `vercel.com/new` → **Import Git Repository**.
2. Seleccionar el repositorio del proyecto.
3. Framework preset: **Next.js** (debe autodetectarse).
4. Build command: `npm run build`.
5. Output directory: `.next` (automático).
6. Install command: `npm ci`.

#### 5.4 Configurar variables de entorno en Vercel

En **Project Settings → Environment Variables**, agregar:

| Variable | Valor | Entornos |
|---|---|---|
| `NODE_ENV` | `production` | Production |
| `NEXT_PUBLIC_APP_NAME` | `Mi Proyecto Fullstack` | All |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | All |

#### 5.5 Activar despliegues automáticos

- Activar **Deploy on Push** para la rama `main` (producción).
- Habilitar **Preview Deployments** para ramas de feature.

#### 5.6 Verificar primer deploy

- Confirmar que Vercel ejecuta el build automáticamente tras el push.
- Revisar los logs del build en Vercel Dashboard.

### Entregables

- [ ] `.github/workflows/ci.yml` funcional.
- [ ] GitHub Actions ejecutándose correctamente en cada push.
- [ ] Repositorio conectado a Vercel.
- [ ] Variables de entorno configuradas en Vercel.
- [ ] Deploy automático activado para `main`.
- [ ] Preview deployments activados para ramas de feature.

### Criterio de aceptación

- [ ] GitHub Actions: ✅ All checks passed.
- [ ] Vercel Dashboard: ✅ Deployment successful.
- [ ] La URL de producción de Vercel carga sin errores.

---

## Fase 6 — Validación en Producción y Cierre

### Objetivo

Validar que el sistema completo funciona correctamente en el entorno de producción de Vercel, documentar cualquier ajuste necesario, y cerrar formalmente la implementación del MVP.

### Tareas

#### 6.1 Verificar Home en producción

- Acceder a la URL de producción proporcionada por Vercel.
- Confirmar que "Hola Mundo" se muestra centrado con la animación completa.
- Verificar que las fuentes (Cormorant Garamond, Montserrat) cargan correctamente.
- Probar en dispositivo móvil (responsive del `clamp()` en font-size).

#### 6.2 Verificar API en producción

```bash
curl https://tu-proyecto.vercel.app/api/data
```

- Confirmar que retorna el JSON de configuración correctamente.
- Verificar headers de respuesta (Content-Type: application/json).

#### 6.3 Revisar logs y métricas

- Revisar logs del build en Vercel Dashboard → sin warnings ni errores.
- Confirmar tiempos de build aceptables.
- Verificar que no hay errores en la pestaña de Functions.

#### 6.4 Probar flujo de preview deployment

- Crear una rama de feature: `git checkout -b feature/test-preview`.
- Hacer un cambio menor (ej: cambiar el greeting en `config.json`).
- Push a la rama y verificar que Vercel genera un preview deployment.
- Acceder a la URL de preview y confirmar el cambio.
- Eliminar la rama de prueba.

#### 6.5 Documentar y cerrar

- Actualizar `README.md` del repositorio con:
  - Descripción del proyecto.
  - Instrucciones de instalación y desarrollo local.
  - Referencia a la URL de producción.
  - Convenciones de commits y branching.
- Confirmar que `data/README.md` documenta el esquema de datos.
- Crear tag de versión: `git tag v1.0.0 && git push --tags`.

### Entregables

- [ ] Home verificado en producción (visual y funcional).
- [ ] API `/api/data` respondiendo correctamente en producción.
- [ ] Preview deployment probado y funcionando.
- [ ] `README.md` actualizado con documentación completa.
- [ ] Tag `v1.0.0` creado en el repositorio.

### Criterio de aceptación final

| Verificación | Entorno | Estado |
|---|---|---|
| "Hola Mundo" visible con animación | Producción | ✅ |
| Saludo proviene del JSON | Producción | ✅ |
| `GET /api/data` retorna JSON | Producción | ✅ |
| GitHub Actions pasa en push | CI | ✅ |
| Deploy automático funciona | Vercel | ✅ |
| Preview deploy funciona | Vercel | ✅ |
| TypeScript strict mode activo | Código | ✅ |
| Logs de build limpios | Vercel | ✅ |
| `README.md` documentado | Repositorio | ✅ |
| Tag `v1.0.0` creado | Git | ✅ |

---

## Apéndice A — Convenciones a seguir durante la implementación

### Commits

```
feat: descripción breve del cambio
fix: corrección del bug X
chore: actualización de dependencias
docs: actualización de documentación
refactor: reestructuración sin cambio de funcionalidad
```

### Nombrado de archivos

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componentes React | PascalCase | `HolaMundo.tsx` |
| Hooks | camelCase con `use` | `useConfig.ts` |
| Utilidades | camelCase | `reader.ts` |
| Tipos/Interfaces | PascalCase | `AppConfig` |
| Archivos JSON | kebab-case | `app-config.json` |
| Variables CSS | kebab-case con `--` | `--color-accent` |

### Reglas TypeScript

- Siempre tipar explícitamente los props de componentes con `interface`.
- No usar `any` — usar `unknown` si el tipo es indeterminado.
- Todas las funciones deben tener tipo de retorno explícito.
- Usar `as const` para objetos y arrays inmutables.

---

## Apéndice B — Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Filesystem efímero de Vercel impide escritura en runtime | Medio | Usar JSON solo para lectura en producción; escritura solo en build-time o desarrollo local |
| Google Fonts no carga por restricción de red | Bajo | Incluir fallbacks en la declaración de `font-family`; considerar fuentes locales en `/public/fonts` |
| GitHub Actions falla por versión de Node | Bajo | Fijar `node-version: '20'` en el workflow |
| Cambios en `data/*.json` no se reflejan sin redeploy | Medio | Documentar que los datos JSON se incluyen en build; cambios requieren push + redeploy |

---

*Plan de implementación generado a partir del documento "Plan de Infraestructura — Fullstack TypeScript + Vercel + JSON Data Layer v1.0.0"*
