# 🔵 RESUMEN FASE 6 — Pipeline CI/CD
> Fecha de ejecución: 2026-04-15 | Rol: Ingeniero Fullstack Senior / DevOps

---

## 🎯 Objetivo

Configurar el pipeline completo de integración y despliegue continuo: GitHub Actions para validación automática en cada commit + vinculación con Vercel para despliegue automático en cada push a `main`. Toda la configuración local (archivos) fue completada en esta sesión. El commit/push y la vinculación con Vercel son los pasos que el usuario debe ejecutar manualmente.

---

## ✅ Estado

| Subtarea | Estado |
|----------|--------|
| Lectura de documentos de referencia | ✅ Completada |
| Cierre formal de Fase 5 + RESUMEN_FASE_5_UI.md | ✅ Completada |
| Creación de `vercel.json` | ✅ Completada |
| Verificación de `.gitignore` | ✅ Completada (sin cambios necesarios) |
| Creación de `.github/workflows/validate.yml` | ✅ Completada |
| Commit y Push a GitHub | ⏸️ Pendiente (requiere Git instalado) |
| Vinculación con Vercel | ⏸️ Pendiente (requiere cuenta Vercel) |
| URL de producción | ⏸️ Pendiente |

---

## 📁 Archivos de Configuración Creados

### `setp-app/vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "regions": ["iad1"]
}
```

**Campos:**
| Campo | Valor | Descripción |
|-------|-------|-------------|
| `framework` | `"nextjs"` | Indica a Vercel que use el preset de Next.js (auto-configura headers, SSR, etc.) |
| `buildCommand` | `"npm run build"` | Comando de build de producción |
| `outputDirectory` | `".next"` | Carpeta de output del build de Next.js |
| `installCommand` | `"npm install"` | Comando de instalación de dependencias |
| `regions` | `["iad1"]` | Región principal: `iad1` = US East (Virginia) — menor latencia desde LatAm |

---

### `setp-app/.github/workflows/validate.yml`

```yaml
name: Validate TypeScript

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  typecheck:
    name: TypeScript Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: setp-app/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: setp-app

      - name: TypeScript check
        run: npm run typecheck
        working-directory: setp-app

  lint:
    name: ESLint Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: setp-app/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: setp-app

      - name: Lint check
        run: npm run lint
        working-directory: setp-app
```

**Diseño del workflow:**
- **Dos jobs separados y paralelos** (`typecheck` + `lint`): corren simultáneamente, reduciendo el tiempo total de CI.
- **Node 20** con caché de `npm` por `package-lock.json` para builds reproducibles y rápidos.
- **`working-directory: setp-app`** en cada step que ejecuta comandos npm — necesario porque la aplicación Next.js está en una subcarpeta (estructura de monorepo parcial).
- **`cache-dependency-path: setp-app/package-lock.json`** para que `actions/setup-node` localice correctamente el lockfile.

---

### `.gitignore` — Verificación

El archivo existente en `setp-app/.gitignore` cumple todos los requisitos del plan:

| Requisito del plan | Cobertura en .gitignore actual | Estado |
|-------------------|-------------------------------|--------|
| `node_modules/` | `/node_modules` | ✅ |
| `.next/` | `/.next/` | ✅ |
| `.env.local` | `.env*` (más amplio) | ✅ |
| `.env*.local` | `.env*` (más amplio) | ✅ |
| `*.log` | `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `.pnpm-debug.log*` | ✅ |
| `.DS_Store` | `.DS_Store` | ✅ |

Sin modificaciones necesarias. Adicionalmente cubre: `.vercel`, `*.tsbuildinfo`, `next-env.d.ts`, `*.pem`, `/coverage`.

---

## 📊 Diagrama Textual del Pipeline Completo

```
┌──────────────────────────────────────────────────────────────────┐
│                     PIPELINE CI/CD                               │
└──────────────────────────────────────────────────────────────────┘

  Desarrollador (Local)
        │
        │  1. git add . && git commit -m "feat: ..."
        │  2. git push origin main
        ▼
  ┌─────────────────────────────────────────────────┐
  │              GitHub Repository                   │
  │              rama: main                          │
  └──────────┬──────────────────────┬───────────────┘
             │                      │
             │ Webhook automático   │ GitHub Actions trigger
             ▼                      ▼
  ┌────────────────────┐  ┌─────────────────────────────┐
  │   Vercel Build     │  │   GitHub Actions CI          │
  │                    │  │                             │
  │  1. npm install    │  │  ┌─────────────────────┐   │
  │  2. tsc --noEmit   │  │  │  Job: typecheck      │   │
  │  3. next build     │  │  │  tsc --noEmit ✅     │   │
  │                    │  │  └─────────────────────┘   │
  │  Si build OK:      │  │                             │
  │  ↓ deploy          │  │  ┌─────────────────────┐   │
  └────────┬───────────┘  │  │  Job: lint           │   │
           │              │  │  next lint ✅        │   │
           ▼              │  └─────────────────────┘   │
  ┌────────────────────┐  │  (ambos en paralelo)        │
  │   Vercel Edge Net  │  └─────────────────────────────┘
  │   (Producción)     │
  │                    │
  │  URL: tu-app.vercel│
  │        .app        │
  └────────────────────┘
```

---

## 🚀 INSTRUCCIONES PARA EL USUARIO — Pasos manuales pendientes

### PASO 4 — Primer commit y push

> ⚠️ Requiere **Git** instalado. Descargar en: https://git-scm.com/download/win

```bash
# Navegar a la raíz del proyecto (donde está setp-app/)
cd C:\Users\lenovo\Downloads\PlataformaSETP-main\PlataformaSETP-main

# Inicializar repositorio (si aún no existe)
git init
git branch -M main

# Agregar remote con TU repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Primer commit con todo el trabajo de Fases 1-6
git add .
git commit -m "feat: initial TypeScript fullstack setup — Fases 1-6 completas"

# Push
git push -u origin main
```

**Verificar en GitHub que:**
- El push llegó correctamente (archivos visibles en el repo)
- GitHub Actions se disparó (tab "Actions" del repositorio)
- Ambos jobs (`TypeScript Check` y `ESLint Check`) pasan ✅

**Log esperado del workflow:**
```
✓ TypeScript Check — tsc --noEmit (exit 0)
✓ ESLint Check — next lint (sin errores)
```

---

### PASO 5 — Vincular con Vercel

1. Ir a **https://vercel.com/new**
2. Hacer clic en **"Add New Project"** → **"Import Git Repository"**
3. Seleccionar el repositorio que acabas de hacer push
4. Vercel detectará automáticamente Next.js
5. **Configurar el Root Directory:** cambiar a `setp-app` (porque la app está en subcarpeta)
6. Variables de entorno: ninguna requerida para el Hola Mundo básico
7. Hacer clic en **Deploy**
8. Esperar el primer build (~60-90 segundos)
9. Registrar la URL de producción generada (ej: `https://setp-app-xyz.vercel.app`)

> 💡 **Importante para la estructura de subcarpeta:** En el paso de configuración de Vercel, el campo "Root Directory" debe configurarse como `setp-app`. Esto le dice a Vercel que el `package.json` y la app Next.js están en esa subcarpeta.

10. **Actualizar ESTADO_EJECUCION.md** con la URL de producción en la sección Fase 6.

---

## 🔍 Observaciones Técnicas

1. **Git no en PATH**: El proyecto fue descargado como ZIP desde GitHub. El usuario necesita instalar Git para poder hacer commit/push.

2. **Estructura monorepo parcial**: La app Next.js está en `setp-app/`, no en la raíz. Esto requiere:
   - `working-directory: setp-app` en GitHub Actions
   - Root Directory = `setp-app` en el configurador de Vercel
   - El `vercel.json` está dentro de `setp-app/` (correcto — Vercel lo lee desde el root directory configurado)

3. **`npm ci` vs `npm install`**: En el workflow de GitHub Actions se usa `npm ci` (Continuous Integration) en vez de `npm install`. La diferencia: `npm ci` requiere `package-lock.json` sincronizado y falla rápido si hay discrepancias — garantiza builds reproducibles.

4. **Región `iad1`**: US East (North Virginia). Es la región de menor latencia desde Latinoamérica en la lista de regiones gratuitas de Vercel.

---

## ✅ Estado Final

**EXITOSO (configuración local)**

Toda la infraestructura de CI/CD está configurada a nivel de archivos:
- `vercel.json` ✅
- `.github/workflows/validate.yml` ✅  
- `.gitignore` verificado ✅
- `RESUMEN_FASE_5_UI.md` generado ✅

**Pendiente de acción del usuario:**
- Instalar Git → `git init` → commit → push → vincular Vercel → URL de producción

---

## 🚀 Próxima Fase

**Fase 7 — Validación y Despliegue Final** — Una vez que el usuario complete el push y la vinculación con Vercel, se ejecuta la validación integral del sistema en producción: `npm run build`, verificación de la URL, prueba de re-deploy automático desde JSON y verificación de GitHub Actions.
