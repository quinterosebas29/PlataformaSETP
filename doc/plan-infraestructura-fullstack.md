# Plan de Infraestructura — Fullstack TypeScript + Vercel + JSON Data Layer

> **Versión:** 1.0.0  
> **Fecha:** Marzo 2026  
> **Arquitecto:** Plan generado como documento de referencia técnica  
> **Stack:** Next.js · TypeScript · Vercel · GitHub · JSON File System

---

## Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Decisiones de Arquitectura](#2-decisiones-de-arquitectura)
3. [Estructura del Repositorio](#3-estructura-del-repositorio)
4. [Stack Tecnológico](#4-stack-tecnológico)
5. [Capa de Datos — JSON File System](#5-capa-de-datos--json-file-system)
6. [Configuración del Proyecto](#6-configuración-del-proyecto)
7. [Implementación del Home — Hola Mundo](#7-implementación-del-home--hola-mundo)
8. [Pipeline CI/CD — GitHub + Vercel](#8-pipeline-cicd--github--vercel)
9. [Variables de Entorno](#9-variables-de-entorno)
10. [Validación de TypeScript](#10-validación-de-typescript)
11. [Checklist de Despliegue](#11-checklist-de-despliegue)
12. [Convenciones y Estándares](#12-convenciones-y-estándares)

---

## 1. Visión General

Este plan describe la infraestructura completa para un sistema **Fullstack en TypeScript** desplegado en **Vercel**, conectado directamente a un repositorio **GitHub**, que sustituye una base de datos convencional por una **capa de persistencia basada en archivos JSON** dentro de la carpeta `/data`.

### Objetivos del MVP

| Objetivo | Descripción |
|---|---|
| ✅ Validar TypeScript | Confirmar que el compilador y el sistema de tipos funcionan end-to-end |
| ✅ Home operativo | Página principal con "Hola Mundo" centrado y efecto visual elegante |
| ✅ Despliegue automático | Push a `main` → deploy automático en Vercel |
| ✅ JSON como base de datos | Lectura/escritura de datos desde archivos `.json` en `/data` |
| ✅ Arquitectura escalable | Estructura lista para crecer sin refactoring mayor |

---

## 2. Decisiones de Arquitectura

### Framework: Next.js 14+ (App Router)

Se elige **Next.js** como framework fullstack por las siguientes razones:

- **TypeScript nativo**: soporte de primera clase sin configuración adicional.
- **App Router**: permite mezclar Server Components y Client Components de forma granular.
- **API Routes**: endpoints backend dentro del mismo repositorio (`/app/api/`).
- **Integración nativa con Vercel**: zero-config deployment, Edge Functions, ISR.
- **File-based routing**: estructura de carpetas predecible y mantenible.

### Por qué JSON en lugar de base de datos convencional

En entornos donde no se requiere concurrencia alta ni transacciones complejas, los archivos JSON en disco ofrecen:

- **Cero dependencias externas**: no hay servicios de base de datos que provisionar.
- **Inspección directa**: los datos son legibles por humanos en cualquier momento.
- **Versionado en Git**: los cambios de datos quedan registrados en el historial.
- **Portabilidad total**: el proyecto funciona en cualquier entorno sin setup.

> ⚠️ **Limitación conocida**: Vercel usa un filesystem efímero en producción (read-only en funciones serverless). Por ello, las operaciones de **escritura** en `/data` aplican solo en desarrollo local o en rutas de build-time. Para lecturas en runtime, Next.js puede acceder a los JSON en build o mediante `fs` en Server Components.

---

## 3. Estructura del Repositorio

```
mi-proyecto/
├── .github/
│   └── workflows/
│       └── ci.yml                  # Pipeline de validación en GitHub Actions
│
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Layout raíz con metadatos globales
│   ├── page.tsx                    # Home — Hola Mundo con efecto elegante
│   ├── globals.css                 # Estilos globales y variables CSS
│   └── api/
│       └── data/
│           └── route.ts            # API Route de ejemplo que lee desde /data
│
├── components/
│   ├── ui/
│   │   └── HolaMundo.tsx           # Componente principal con animación
│   └── layout/
│       └── PageWrapper.tsx         # Wrapper de páginas con estilos base
│
├── data/                           # 📁 Capa de datos — JSON File System
│   ├── README.md                   # Documentación del esquema de datos
│   └── config.json                 # Configuración general de la app
│
├── lib/
│   ├── db/
│   │   ├── index.ts                # Exportaciones centrales del cliente JSON
│   │   ├── reader.ts               # Utilidades para leer archivos JSON
│   │   └── types.ts                # Interfaces TypeScript de los modelos de datos
│   └── utils/
│       └── cn.ts                   # Utilidad de clases CSS condicionales
│
├── public/
│   └── fonts/                      # Fuentes locales (opcional)
│
├── types/
│   └── index.ts                    # Tipos globales del proyecto
│
├── .env.local                      # Variables de entorno locales (no se sube a Git)
├── .env.example                    # Plantilla de variables de entorno
├── .gitignore
├── next.config.ts                  # Configuración de Next.js en TypeScript
├── tsconfig.json                   # Configuración de TypeScript
├── package.json
└── README.md
```

---

## 4. Stack Tecnológico

### Dependencias Principales

| Paquete | Versión | Propósito |
|---|---|---|
| `next` | `^14.x` | Framework fullstack |
| `react` | `^18.x` | Librería UI |
| `react-dom` | `^18.x` | Renderizado DOM |
| `typescript` | `^5.x` | Tipado estático |

### Dependencias de Desarrollo

| Paquete | Versión | Propósito |
|---|---|---|
| `@types/node` | `^20.x` | Tipos de Node.js |
| `@types/react` | `^18.x` | Tipos de React |
| `@types/react-dom` | `^18.x` | Tipos de React DOM |
| `eslint` | `^8.x` | Linter de código |
| `eslint-config-next` | `^14.x` | Reglas ESLint para Next.js |
| `prettier` | `^3.x` | Formateador de código |

### Configuración tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

> **Nota clave**: `"strict": true` activa todas las verificaciones estrictas de TypeScript, lo que valida de forma exhaustiva el sistema de tipos en todo el proyecto.

---

## 5. Capa de Datos — JSON File System

### Filosofía del diseño

La carpeta `/data` actúa como una base de datos plana. Cada archivo `.json` representa una **colección** de documentos, análogo a una tabla en SQL o una colección en MongoDB.

### Estructura de `/data`

```
data/
├── README.md          # Esquema y convenciones documentadas
└── config.json        # Datos de configuración global
```

### Ejemplo: `data/config.json`

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

### Tipos TypeScript para los datos — `lib/db/types.ts`

```typescript
// lib/db/types.ts

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

### Cliente de lectura — `lib/db/reader.ts`

```typescript
// lib/db/reader.ts
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}
```

### API Route de ejemplo — `app/api/data/route.ts`

```typescript
// app/api/data/route.ts
import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/db/reader';
import type { AppConfig } from '@/lib/db/types';

export async function GET() {
  const config = readJSON<AppConfig>('config');
  return NextResponse.json(config);
}
```

---

## 6. Configuración del Proyecto

### `package.json` — Scripts principales

```json
{
  "name": "mi-proyecto-fullstack",
  "version": "1.0.0",
  "private": true,
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

### `next.config.ts`

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false, // TypeScript DEBE pasar para hacer build
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
```

---

## 7. Implementación del Home — Hola Mundo

### Concepto visual

El Home presentará el texto **"Hola Mundo"** centrado en pantalla con un efecto elegante de **aparición gradual con desplazamiento vertical suave** (`fade-in + slide-up`), acompañado de un fondo con gradiente sutil animado. La estética es **luxury minimalista**: tipografía serif refinada, mucho espacio negativo y una paleta monocromática con un acento dorado.

### `app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400&display=swap');

:root {
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-text: #f0ece4;
  --color-accent: #c9a96e;
  --color-muted: #5a5a5a;
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Montserrat', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes lineExpand {
  from { width: 0; }
  to { width: 80px; }
}
```

### `components/ui/HolaMundo.tsx`

```typescript
// components/ui/HolaMundo.tsx
'use client';

interface HolaMundoProps {
  greeting?: string;
}

export default function HolaMundo({ greeting = 'Hola Mundo' }: HolaMundoProps) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1.5rem',
        padding: '2rem',
        animation: 'fadeSlideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          animation: 'fadeSlideUp 1.2s 0.2s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        TypeScript · Next.js · Vercel
      </p>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 10vw, 7rem)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          textAlign: 'center',
          color: 'var(--color-text)',
          animation: 'fadeSlideUp 1.2s 0.4s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {greeting}
      </h1>

      <div
        style={{
          width: '80px',
          height: '1px',
          background: 'var(--color-accent)',
          animation: 'lineExpand 1.2s 1s ease both, shimmer 3s 2.2s ease-in-out infinite',
        }}
      />

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--color-muted)',
          letterSpacing: '0.1em',
          animation: 'fadeSlideUp 1.2s 0.8s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        Sistema operativo ✓
      </p>
    </section>
  );
}
```

### `app/page.tsx`

```typescript
// app/page.tsx
import { readJSON } from '@/lib/db/reader';
import type { AppConfig } from '@/lib/db/types';
import HolaMundo from '@/components/ui/HolaMundo';

export default function HomePage() {
  const config = readJSON<AppConfig>('config');

  return (
    <main>
      <HolaMundo greeting={config.app.greeting} />
    </main>
  );
}
```

### `app/layout.tsx`

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mi Proyecto Fullstack',
  description: 'Sistema TypeScript con Next.js y Vercel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

---

## 8. Pipeline CI/CD — GitHub + Vercel

### Flujo de trabajo

```
Desarrollador
     │
     ▼
git push origin main / feature/*
     │
     ├──► GitHub Actions (ci.yml)
     │         ├── npm ci
     │         ├── tsc --noEmit     ← Validación TypeScript
     │         ├── next lint        ← ESLint
     │         └── next build       ← Build de producción
     │
     └──► Vercel (automático via webhook)
               ├── Preview deploy  (branches ≠ main)
               └── Production deploy (main)
```

### `.github/workflows/ci.yml`

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

### Configuración en Vercel

1. Importar el repositorio desde **vercel.com/new** → _Import Git Repository_.
2. Seleccionar el repositorio de GitHub.
3. Framework preset: **Next.js** (autodetectado).
4. Build command: `npm run build`
5. Output directory: `.next` (automático)
6. Install command: `npm ci`
7. Activar **Deploy on Push** para la rama `main`.
8. Habilitar **Preview Deployments** para ramas de feature.

---

## 9. Variables de Entorno

### `.env.example` (se sube al repositorio)

```env
# Entorno
NODE_ENV=development

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=Mi Proyecto Fullstack
NEXT_PUBLIC_APP_VERSION=1.0.0

# Ruta de datos (opcional, se puede dejar vacío)
DATA_DIR=./data
```

### `.env.local` (NO se sube — añadir al `.gitignore`)

```env
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Mi Proyecto Fullstack
```

### En Vercel

Configurar en **Project Settings → Environment Variables** las mismas variables con sus valores de producción. Las variables prefijadas con `NEXT_PUBLIC_` son accesibles en el cliente.

---

## 10. Validación de TypeScript

Para confirmar que TypeScript funciona correctamente en toda la cadena:

### Validación local

```bash
# 1. Verificar tipos sin compilar
npm run type-check

# 2. Build completo (fallará si hay errores de tipos)
npm run build

# 3. Validación combinada
npm run validate
```

### Indicadores de éxito

| Verificación | Resultado esperado |
|---|---|
| `tsc --noEmit` | Sin errores de tipos |
| `next build` | Build exitoso, sin warnings de TypeScript |
| API `/api/data` | Retorna JSON tipado correctamente |
| Home cargado | "Hola Mundo" visible con animación |
| GitHub Actions | ✅ All checks passed |
| Vercel | ✅ Deployment successful |

### Prueba de tipos end-to-end

La cadena de validación TypeScript cubre:

```
data/config.json
       ↓ readJSON<AppConfig>()     ← lib/db/reader.ts (tipos verificados)
       ↓
app/page.tsx                       ← Server Component (tipos verificados)
       ↓
<HolaMundo greeting={...} />       ← Props tipadas (HolaMundoProps)
       ↓
Renderizado en el navegador        ← ✅ Sistema de tipos validado
```

---

## 11. Checklist de Despliegue

### Fase 1 — Inicialización del proyecto

- [ ] Crear repositorio en GitHub (público o privado)
- [ ] Inicializar proyecto: `npx create-next-app@latest . --typescript --eslint --app --src-dir no`
- [ ] Crear estructura de carpetas según el plan
- [ ] Crear `data/config.json` con datos iniciales
- [ ] Implementar `lib/db/reader.ts` y `lib/db/types.ts`
- [ ] Implementar `components/ui/HolaMundo.tsx`
- [ ] Implementar `app/page.tsx` y `app/layout.tsx`
- [ ] Agregar estilos en `app/globals.css`

### Fase 2 — Validación local

- [ ] `npm run dev` → verificar Home en `localhost:3000`
- [ ] Confirmar efecto de animación visible
- [ ] Confirmar que el saludo viene del JSON
- [ ] `npm run type-check` → sin errores
- [ ] `npm run lint` → sin errores
- [ ] `npm run build` → build exitoso
- [ ] Probar `GET /api/data` → respuesta JSON correcta

### Fase 3 — Configuración CI/CD

- [ ] Crear `.github/workflows/ci.yml`
- [ ] Hacer push a `main` y verificar que Actions pase
- [ ] Conectar repositorio a Vercel
- [ ] Configurar variables de entorno en Vercel
- [ ] Verificar deploy automático en producción

### Fase 4 — Validación en producción

- [ ] Acceder a la URL de Vercel y verificar Home
- [ ] Confirmar animación en producción
- [ ] Verificar endpoint `/api/data` en producción
- [ ] Revisar logs de Vercel para confirmar build limpio

---

## 12. Convenciones y Estándares

### Nombrado de archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
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

### Estructura de commits

```
feat: descripción breve del cambio
fix: corrección del bug X
chore: actualización de dependencias
docs: actualización de documentación
refactor: reestructuración sin cambio de funcionalidad
```

---

*Documento generado como plan de referencia técnica — Arquitectura Fullstack TypeScript v1.0*
