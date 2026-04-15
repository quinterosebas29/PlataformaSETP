# 📁 Capa de Datos — JSON como Base de Datos

> Esta carpeta actúa como capa de persistencia plana del sistema.  
> **Versión 1.1** | Fullstack TypeScript + Vercel + GitHub | Actualizado: Fase 2

---

## ⚠️ Regla de Oro

Los archivos JSON en `/data` **jamás son accedidos directamente desde el cliente**.  
Toda lectura ocurre en **Server Components** o **Route Handlers** a través de `lib/dataService.ts`.

```
✅ CORRECTO: Server Component → readJsonFile('home.json')
❌ INCORRECTO: import homeData from '../data/home.json'  (desde un Client Component)
```

---

## 📄 Archivos JSON del sistema

| Archivo | Dominio | Descripción | Schema de validación |
|---------|---------|-------------|---------------------|
| `config.json` | Configuración global | Nombre de la app, versión, locale, tema | `AppConfigSchema` (Fase 3) |
| `home.json` | Página Home | Contenido del hero, metadata de la página | `HomeDataSchema` (Fase 3) |

---

## 🗂️ Estructura de cada archivo

### `config.json`
```json
{
  "appName": "Mi App TypeScript",
  "version": "1.0.0",
  "locale":  "es-CO",
  "theme":   "dark"
}
```

**Tipos:**
- `appName`: `string` — Nombre visible de la aplicación
- `version`: `string` — Versión en formato semver
- `locale`: `string` — Código de locale (ej: `es-CO`, `en-US`)
- `theme`: `"light" | "dark"` — Tema visual de la aplicación

---

### `home.json`
```json
{
  "hero": {
    "title":          "Hola Mundo",
    "subtitle":       "TypeScript + Next.js + Vercel",
    "description":    "Sistema fullstack funcionando correctamente.",
    "animationStyle": "typewriter"
  },
  "meta": {
    "pageTitle":   "Home | Mi App",
    "description": "Página principal del sistema"
  }
}
```

**Tipos:**
- `hero.title`: `string` — Título principal animado
- `hero.subtitle`: `string` — Subtítulo debajo del título
- `hero.description`: `string` — Descripción corta del sistema
- `hero.animationStyle`: `"typewriter" | "fadeIn" | "slideUp"` — Estilo de animación
- `meta.pageTitle`: `string` — Título visible en la pestaña del browser
- `meta.description`: `string` — Meta description para SEO

---

## 🔧 Cómo leer un archivo JSON (uso correcto)

```typescript
// En un Server Component o Route Handler únicamente:
import { readJsonFile } from '@/lib/dataService';
import type { HomeData } from '@/lib/types';

const data = readJsonFile<HomeData>('home.json');
```

---

## ✅ Reglas de acceso a datos

1. **Solo lectura en servidor**: los JSONs nunca se exponen al cliente directamente.
2. **Validación obligatoria**: todo JSON leído debe pasar por su schema Zod (`lib/validators.ts`).
3. **Un archivo por dominio**: cada entidad conceptual tiene su propio JSON.
4. **Sin lógica en JSON**: los archivos solo contienen datos, nunca funciones.
5. **Leer mediante `lib/dataService.ts`**: nunca importar directamente desde Client Components.

---

## ➕ Cómo agregar un nuevo archivo JSON

Sigue este protocolo para cada nuevo dominio de datos:

**Paso 1 — Crear el archivo JSON:**
```
data/mi-entidad.json
```

**Paso 2 — Definir la interfaz TypeScript en `lib/types.ts`:**
```typescript
export interface MiEntidad {
  campo: string;
  // ...
}
```

**Paso 3 — Crear el schema Zod en `lib/validators.ts`:**
```typescript
export const MiEntidadSchema = z.object({
  campo: z.string(),
  // ...
});
```

**Paso 4 — Agregar función tipada en `lib/dataService.ts`:**
```typescript
export function readMiEntidad(): MiEntidad {
  const raw = readJsonFile<MiEntidad>('mi-entidad.json');
  return MiEntidadSchema.parse(raw);
}
```

**Paso 5 — Consumir desde Server Component o Route Handler:**
```typescript
// app/mi-pagina/page.tsx  (Server Component, sin "use client")
import { readMiEntidad } from '@/lib/dataService';

export default function MiPagina() {
  const data = readMiEntidad();
  return <div>{data.campo}</div>;
}
```

---

*Documentación actualizada en Fase 2 — Capa de Datos JSON | 2026-04-08*
