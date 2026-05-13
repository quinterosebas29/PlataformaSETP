# PROMPT 0 — FUNDACIÓN: SETP SM
> Ejecutar PRIMERO — en equipo o asignado a un integrante
> Nadie empieza su stream hasta que esto esté commiteado en `main`
> Plan de referencia: `doc/PLAN_SETP.md`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack Senior especializado en
Next.js + Supabase + Realtime + Vercel Cron, y como diseñador de sistemas
que implementa design tokens en código. Tu tarea es crear la fundación
completa del proyecto SETP SM: una aplicación web Mobile-First que muestra
el transporte público de Santa Marta en tiempo real.

CARÁCTER DEL SISTEMA:
- App pública sin login. La identidad del usuario es un UUID en localStorage.
- Tiempo real GENUINO: Vercel Cron actualiza Supabase cada minuto y todos
  los clientes lo ven simultáneamente vía Supabase Realtime.
- Mobile-First — diseñada para 390px y se adapta a tablet/desktop.
- 3 streams paralelos sin conflictos después de esta fundación.

Antes de escribir código lee doc/PLAN_SETP.md completo. Presta especial
atención a:
- Sección 6: stack y variables de entorno (incluyendo CRON_SECRET)
- Sección 7: arquitectura de tiempo real (cron → Supabase → Realtime → cliente)
- Sección 8-9: bootstrap, migrations 0001-0004 (la 0004 habilita Realtime)
- Sección 10: API del dataService
- Sección 11: lógica completa de simulateBusesTick
- Sección 14: estructura de carpetas (App Router con `(tabs)` group)
- Sección 15: variables CSS y tipografía
- Sección 20: protocolo de colaboración

LO QUE DEBES CREAR:

1. PROYECTO NEXT.JS
   npx create-next-app@latest setp-sm --typescript --tailwind --app --src-dir
   Instalar:
   - @supabase/supabase-js pg @types/pg
   - react-leaflet leaflet @types/leaflet
   - framer-motion lucide-react
   - zod
   - @next/font (incluido)
   Configurar Tailwind 4 con las variables CSS del design system.

2. CONFIGURACIÓN DE FUENTES en `app/layout.tsx`
   Cargar Plus_Jakarta_Sans (weights: 600, 700) y DM_Sans (weights: 400, 500)
   con next/font/google. Definir variables CSS:
   --font-display, --font-body.

3. DESIGN SYSTEM en `app/globals.css`
   Implementar TODAS las variables CSS de la sección 15 del plan.
   Incluir: colores de marca, colores de las 3 rutas, colores de estado,
   colores de offline. Configurar @theme inline de Tailwind 4 para que las
   variables sean usables como clases.

4. ESTRUCTURA DE CARPETAS según sección 14 del plan.

5. SUPABASE CLIENTS (lib/)
   - lib/supabase.ts → server-side client con SUPABASE_SERVICE_ROLE_KEY
   - lib/supabase-client.ts → browser client con NEXT_PUBLIC_SUPABASE_ANON_KEY
     (este es el que usan los hooks Realtime)

6. MIGRATIONS (supabase/migrations/)
   Implementar 0001_init_catalog.sql, 0002_init_buses.sql,
   0003_init_favorites.sql, 0004_enable_realtime.sql EXACTAMENTE como
   están en la sección 9 del plan. La 0004 es CRÍTICA: habilita Realtime
   para la tabla buses.

7. SEED Y SEEDREADER
   Crear data/seed.json con las 3 rutas, 10 paradas, 14 route_stops y 4
   buses iniciales (sección 8.1 del plan — coordenadas reales de Santa Marta).
   Crear lib/seedReader.ts que expone routes, stops y buses para modo seed.

8. PG MIGRATE
   Crear lib/pgMigrate.ts que aplica las migrations en orden y registra
   en la tabla _migrations. Patrón estándar del curso.

9. DATA SERVICE COMPLETO (lib/dataService.ts)
   Implementar todos los métodos de la sección 10 del plan:
   - getSystemMode, getRoutes, getStops, getRouteStops
   - getNearbyStops (calcula distancia haversine)
   - getActiveBuses, getBusById
   - getFavorites, addFavorite, removeFavorite
   - simulateBusesTick (lógica completa de la sección 11)

10. SIMULACIÓN DE BUSES (lib/busSimulation.ts)
    Implementar interpolatePosition(currentStop, nextStop, progress)
    que retorna { lat, lng } interpolando linealmente.

11. ENDPOINT DE CRON (app/api/cron/simulate/route.ts)
    Verificar header Authorization === `Bearer ${process.env.CRON_SECRET}`.
    Si no coincide: 401.
    Si sí: llamar a dataService.simulateBusesTick() y retornar { updated: N }.

12. VERCEL CRON CONFIG (vercel.json)
    {
      "crons": [
        { "path": "/api/cron/simulate", "schedule": "*/1 * * * *" }
      ]
    }

13. COMPONENTES COMPARTIDOS (components/)
    - components/ui/Button.tsx (Primary y Outline)
    - components/ui/Input.tsx
    - components/ui/Toast.tsx
    - components/ui/Sheet.tsx (bottom sheet con Framer Motion drag, snapPoints)
    - components/shared/RouteChip.tsx (chip [03] [11] [16] con color de ruta)
    - components/shared/ETABadge.tsx (verde si <5min, naranja >10min)
    - components/shared/BusCard.tsx (tarjeta en lista)
    - components/shared/StopListItem.tsx (con barras de ETA proporcionales)
    - components/layout/BottomNav.tsx (3 tabs: Mapa/Rutas/Favoritas)
    - components/layout/OfflineBanner.tsx (amarillo persistente)

14. NAVEGACIÓN CON STUBS
    - app/page.tsx → stub: redirect inmediato a /(tabs)/map (Stream C lo
      reemplaza con Splash + decisor)
    - app/onboarding/page.tsx, app/permission/page.tsx → stubs vacíos
    - app/(tabs)/layout.tsx → BottomNav real, hijo es children
    - app/(tabs)/map/page.tsx, app/(tabs)/routes/page.tsx,
      app/(tabs)/favorites/page.tsx → stubs vacíos con texto "[Stream X] Pantalla X"
    - app/(tabs)/routes/results/page.tsx, app/(tabs)/routes/trip/page.tsx → stubs
    - app/stops/page.tsx, app/stops/[id]/page.tsx → stubs

15. DEVICE ID (lib/deviceId.ts + lib/hooks/useDeviceId.ts)
    'use client'
    getOrCreateDeviceId() lee/escribe localStorage.setp_device_id
    useDeviceId() retorna el deviceId (null durante SSR, string en cliente)

16. PÁGINA DE BOOTSTRAP (app/admin/db-setup/page.tsx)
    Patrón estándar del curso:
    - Estado actual del sistema (modo seed/live)
    - Botón "Aplicar bootstrap" con campo para ADMIN_BOOTSTRAP_SECRET
    - Llama a /api/system/bootstrap
    - Muestra resultado con detalles de migrations aplicadas

17. API ROUTES BÁSICAS
    - app/api/system/mode/route.ts → retorna 'seed' | 'live'
    - app/api/system/diagnose/route.ts → estado de migrations + seed
    - app/api/system/bootstrap/route.ts → aplica migrations + seed
    - app/api/routes/route.ts → GET lista de rutas
    - app/api/stops/route.ts → GET lista de paradas
    - app/api/buses/route.ts → GET buses activos (lectura inicial)

18. NEXT.CONFIG.TS
    Headers `no-store` para /api/:path*

19. VARIABLES DE ENTORNO (.env.local)
    NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL,
    ADMIN_BOOTSTRAP_SECRET (cualquier string), CRON_SECRET (otro string)

AL TERMINAR:
- npm run typecheck → cero errores
- npm run dev → app corre en localhost:3000
- En localhost: ver tabs Mapa / Rutas / Favoritas con stubs
- Ir a /admin/db-setup → ejecutar bootstrap → modo live
- Verificar en Supabase Studio que las 4 tablas existen y tienen datos
- Verificar en Supabase Studio > Database > Replication que la tabla
  `buses` está en la publicación supabase_realtime
- Llamar manualmente al cron con curl:
  curl -X POST http://localhost:3000/api/cron/simulate \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  → debe retornar { updated: 4 }
  → en Supabase, verificar que current_lat y current_lng tienen valores

- Hacer commit:
  git add -A
  git commit -m "feat: fundación completa SETP SM (Supabase + Realtime + Cron)"
  git push origin main

- Notificar al equipo: "Fundación lista. Pueden crear sus branches:
  - Pedro: feat/stream-a-mapa
  - Sebastián: feat/stream-b-planificador
  - Richard: feat/stream-c-discovery"

IMPORTANTE: No implementes ninguna pantalla real (mapa, planificador, etc.).
Solo stubs. Las pantallas las hacen los streams en branches paralelos.

Tu trabajo termina aquí.
```
