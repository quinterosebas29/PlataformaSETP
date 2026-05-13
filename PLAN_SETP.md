# SETP SM — Plan Maestro del Sistema
> Sistema de Información al Usuario — Transporte Público Santa Marta | Versión 1.0
> Proyecto de Grado | Mayo 2026
> Stack: Next.js + TypeScript + Supabase Postgres + Supabase Realtime + Vercel
> Equipo: Pedro José Jiménez · Sebastián Quintero · Richard Díaz
> Tutor: María José García Acosta — Universidad Sergio Arboleda, Diseño Digital

---

## Nota sobre el stack

El documento de especificación original describe un prototipo en React Native + Expo con datos simulados localmente. Este plan adapta el sistema al **stack estándar del curso** (Next.js + Supabase + Vercel) por dos razones:

1. **Tiempo real genuino:** Supabase Realtime permite que múltiples dispositivos vean simultáneamente el movimiento de los buses. El "tiempo real" deja de ser una simulación local y se vuelve un sincronizado entre clientes.
2. **Coherencia con el curso:** mismo stack, mismo bootstrap, mismo flujo de evaluación que los demás proyectos.

Conservamos el carácter Mobile-First del spec — la app se diseña para 390px y se prueba primero en celular. Vercel + el manifest de PWA permiten que se sienta como una app nativa.

---

## Índice General

1. [Definición del sistema](#1-definición-del-sistema)
2. [Actores del sistema](#2-actores-del-sistema)
3. [Casos de uso](#3-casos-de-uso)
4. [Requerimientos funcionales](#4-requerimientos-funcionales)
5. [Reglas de negocio](#5-reglas-de-negocio)
6. [Stack tecnológico](#6-stack-tecnológico)
7. [Arquitectura de persistencia y tiempo real](#7-arquitectura)
8. [Bootstrap y migrations](#8-bootstrap)
9. [Modelo de datos — Supabase Postgres](#9-modelo-de-datos)
10. [Capa de datos unificada (dataService)](#10-dataservice)
11. [Simulación de buses (Vercel Cron)](#11-simulación)
12. [Suscripción a Realtime en el cliente](#12-realtime)
13. [Identidad de dispositivo y favoritos](#13-favoritos)
14. [Arquitectura de rutas (App Router)](#14-rutas)
15. [Sistema de diseño](#15-diseño)
16. [Inventario de pantallas y propiedad por stream](#16-pantallas)
17. [Stream A — Mapa y tiempo real (Pedro)](#17-stream-a)
18. [Stream B — Planificador (Sebastián)](#18-stream-b)
19. [Stream C — Descubrimiento, Favoritos y Onboarding (Richard)](#19-stream-c)
20. [Plan de trabajo y protocolo sin conflictos](#20-protocolo)
21. [Glosario](#21-glosario)

---

## 1. Definición del sistema

**SETP SM** es una aplicación web Mobile-First que muestra en tiempo real la posición de los buses del Sistema Estratégico de Transporte Público de Santa Marta. Permite ver dónde está cada bus, cuánto tarda en llegar a las paradas cercanas, planificar viajes con opciones de ruta y guardar rutas favoritas para acceso rápido.

El sistema es **público y gratuito** — no requiere registro ni login. Cada dispositivo se identifica internamente con un UUID generado en el primer uso (almacenado en localStorage) que vincula los favoritos del usuario.

El prototipo cubre las **3 rutas reales del SETP Santa Marta**: Ruta 03 (Mamatoco–Centro), Ruta 11 (Bastidas–Taganga) y Ruta 16 (Gaira–El Rodadero), con coordenadas geográficas reales de las paradas.

---

## 2. Actores del sistema

| Actor | Tipo | Descripción |
|---|---|---|
| **Usuario público** | Externo | Cualquier ciudadano. Sin registro. Identificado por device_id en localStorage. |
| **Sistema** | No humano | Vercel Cron simula el movimiento de los buses cada minuto y actualiza Supabase. Supabase Realtime propaga los cambios a todos los clientes conectados. |
| **Admin técnico** | Interno (oculto) | Solo accede a `/admin/db-setup` para bootstrap inicial. No es un rol del producto final. |

> No existe el rol de "operador del SETP" porque este es un prototipo de cara al usuario, no un panel de gestión interna.

---

## 3. Casos de uso

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-01 | Ver primer uso (onboarding) | Usuario | Splash → 3 slides de onboarding → solicitud de permiso de ubicación → Mapa principal. Solo se muestra una vez (flag en localStorage). |
| CU-02 | Ver buses en el mapa | Usuario | Pantalla principal con mapa, marcadores de buses con chip de color de ruta, posición del usuario y paradas cercanas. Los buses se mueven en tiempo real vía Supabase Realtime. |
| CU-03 | Ver detalle de un bus | Usuario | Al tocar un marcador en el mapa, se abre un bottom sheet con la ruta, ETA a la próxima parada y opciones de seguir el bus o ver la ruta completa. |
| CU-04 | Planificar un viaje | Usuario | Ingresar origen y destino → ver opciones de ruta con tiempo estimado y transbordos → seleccionar opción → ver detalle con mapa de la ruta. |
| CU-05 | Activar alerta de llegada | Usuario | Desde el detalle de un viaje o parada, configurar alerta cuando el bus esté a 5/10/15 min. (En el prototipo, la alerta se simula con un toast de confirmación.) |
| CU-06 | Ver paradas cercanas | Usuario | Lista de paradas ordenadas por distancia con los buses que llegarán a cada una. |
| CU-07 | Ver detalle de una parada | Usuario | Mapa pequeño + lista de buses en camino con ETA actualizado en tiempo real. |
| CU-08 | Guardar ruta como favorita | Usuario | Toque en estrella → ruta queda asociada al device_id en Supabase. |
| CU-09 | Ver rutas favoritas | Usuario | Lista de rutas guardadas. Acceso rápido a su detalle. |
| CU-10 | Detectar pérdida de conexión | Sistema | Banner amarillo persistente cuando se pierde la conexión. Buses semitransparentes indicando datos cacheados. |

---

## 4. Requerimientos funcionales

| ID | Requerimiento |
|---|---|
| RF-B1 | El sistema debe poder ejecutarse sin Supabase configurado, sirviendo el seed de `data/` para mostrar las rutas y paradas iniciales. |
| RF-B2 | El sistema debe ofrecer `/admin/db-setup` con secreto para diagnóstico, migrations y seed inicial. |
| RF-01 | El sistema muestra un onboarding de 3 slides en el primer uso. |
| RF-02 | El sistema solicita permiso de ubicación al usuario tras el onboarding. |
| RF-03 | La pantalla principal muestra un mapa con la ubicación del usuario y los buses del SETP en tiempo real. |
| RF-04 | El sistema actualiza la posición de los buses automáticamente cada minuto sin intervención del usuario. |
| RF-05 | El usuario puede tocar un bus en el mapa para ver su información detallada. |
| RF-06 | El sistema permite planificar viajes ingresando origen y destino con autocompletado de paradas. |
| RF-07 | El sistema muestra opciones de ruta para el viaje solicitado, ordenadas por tiempo estimado. |
| RF-08 | El usuario puede ver el listado de paradas cercanas ordenadas por distancia. |
| RF-09 | El usuario puede guardar y listar sus rutas favoritas, persistidas por device_id. |
| RF-10 | El sistema detecta automáticamente la pérdida de conexión y muestra un banner indicando que los datos pueden estar desactualizados. |
| RF-11 | La interfaz se diseña primero para 390px de ancho y se adapta progresivamente a tablet y desktop. |

---

## 5. Reglas de negocio

| ID | Regla | Implementación técnica |
|---|---|---|
| RN-01 | El sistema no requiere login. La identidad del usuario se basa en un UUID generado en el primer uso, guardado en localStorage como `setp_device_id`. | Función `getOrCreateDeviceId()` en `lib/deviceId.ts`. |
| RN-02 | Cada bus pertenece a una sola ruta y avanza secuencialmente por las paradas de esa ruta. Al llegar a la última, reinicia en la primera. | El cron actualiza `current_stop_index` modulando por la longitud de la ruta. |
| RN-03 | La posición geográfica del bus se interpola entre las coordenadas de la parada actual y la siguiente, en función del ETA restante. | Función `interpolatePosition()` en `lib/busSimulation.ts`. |
| RN-04 | El estado del bus puede ser `en_ruta`, `demorado` o `fuera_de_servicio`. Solo los buses en ruta o demorados aparecen en el mapa. | Filtro en `getActiveBuses()`. |
| RN-05 | Un usuario no puede tener más de una entrada de favorito por ruta. | UNIQUE en `favorites(device_id, route_id)`. |
| RN-06 | El cliente debe ver actualizaciones de buses sin recargar la página. | Suscripción a Supabase Realtime en la tabla `buses`. |
| RN-07 | El ETA al usuario se calcula localmente entre cada actualización del servidor — el cliente decrementa cada segundo el `eta_to_next_stop_seconds` recibido. | `useETACountdown` hook en el cliente. |
| RN-08 | Si el cliente pierde la conexión, debe mostrar la última posición conocida con opacidad reducida. | Cache local + `useNetworkStatus` hook. |
| RN-09 | El primer uso del onboarding se determina por la presencia del flag `setp_onboarding_done` en localStorage. | Verificación en la página raíz `/`. |

---

## 6. Stack tecnológico

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.x | Rutas, server components, API routes |
| Lenguaje | TypeScript | 5.x | Tipado estático |
| UI | React | 19.x | Componentes del cliente |
| Estilos | Tailwind CSS | 4.x | Utilidades, Mobile-First responsive |
| Animaciones | Framer Motion | 12.x | Bottom sheets, transiciones, spring |
| Validación | Zod | 4.x | Validación servidor y cliente |
| Base de datos | Supabase Postgres | — | Datos estructurados |
| **Tiempo real** | **Supabase Realtime** | — | **Cambios en `buses` propagados a todos los clientes** |
| Cliente DB (migrations) | `pg` (node-postgres) | 8.x | SQL crudo desde bootstrap |
| Cliente DB (queries) | `@supabase/supabase-js` | 2.x | Queries y suscripciones Realtime |
| Mapa | `react-leaflet` + `leaflet` | 4.x | Mapa interactivo (gratis, sin API key) |
| Iconos | Lucide React | — | Iconografía |
| Tipografía | Plus Jakarta Sans + DM Sans | — | `next/font/google` |
| **Cron** | **Vercel Cron** | — | **Simulación de buses cada minuto** |
| Deploy | Vercel | — | Hosting + Cron |

### Variables de entorno requeridas

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
ADMIN_BOOTSTRAP_SECRET=
CRON_SECRET=                  # Para autenticar el endpoint de Vercel Cron
```

> **Nota sobre el mapa:** Usamos `react-leaflet` con OpenStreetMap como fuente de tiles. Es gratis, sin API key y suficiente para el prototipo. Para producción real podría sustituirse por Mapbox.

---

## 7. Arquitectura de persistencia y tiempo real

### 7.1 Flujo completo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│  Vercel Cron (cada minuto)                                      │
│  POST /api/cron/simulate                                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │ (1) actualiza posición y ETA
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Supabase Postgres                                              │
│  UPDATE buses SET current_lat, current_lng, eta...              │
└──────────────────────────────┬──────────────────────────────────┘
                               │ (2) trigger automático de Realtime
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Supabase Realtime (WebSocket)                                  │
│  Broadcast del cambio a todos los clientes suscritos            │
└──────────────────────────────┬──────────────────────────────────┘
                               │ (3) push a los clientes
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Cliente Next.js (Mapa)                                         │
│  useBusSubscription() actualiza el estado y re-renderiza        │
│  Animación con Framer Motion entre posiciones                   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Reglas de oro

1. **`dataService.ts` es el ÚNICO punto de acceso a datos en el servidor** (API Routes y server components).
2. **El cliente se suscribe a Realtime DIRECTAMENTE** con el `@supabase/supabase-js` client — no pasa por dataService.
3. **El cron es la única fuente que muta el estado de los buses.** Los clientes nunca escriben en `buses`.
4. **El countdown en el cliente es solo visual** — la próxima sincronización con el servidor corrige cualquier desviación.
5. **La transición visual entre posiciones la maneja Framer Motion** con animación spring suave.
6. **Las pantallas que muestran datos en tiempo real son `'use client'`** porque necesitan suscripciones WebSocket.
7. **Los servidor components solo se usan para datos estáticos** (catálogo de rutas y paradas).

---

## 8. Bootstrap y migrations

### 8.1 Estructura de `data/` (solo semilla)

```
data/
  config.json     ← { "version": "1.0", "system_name": "SETP SM" }
  seed.json       ← {
                      "routes": [
                        { id: "03", name: "Mamatoco – Centro Histórico", color: "#2563EB" },
                        { id: "11", name: "Bastidas – Taganga",          color: "#16A34A" },
                        { id: "16", name: "Gaira – El Rodadero",         color: "#DC2626" }
                      ],
                      "stops": [
                        { id: "s01", name: "Parada Mamatoco",          lat: 11.2490, lng: -74.1820 },
                        { id: "s02", name: "Estadio Sierra Nevada",    lat: 11.2380, lng: -74.1900 },
                        { id: "s03", name: "Av. del Río",              lat: 11.2330, lng: -74.1935 },
                        { id: "s04", name: "Universidad Sergio Arboleda", lat: 11.2310, lng: -74.1950 },
                        { id: "s05", name: "Catedral",                 lat: 11.2408, lng: -74.2073 },
                        { id: "s06", name: "Mercado / Centro Histórico", lat: 11.2440, lng: -74.2100 },
                        { id: "s07", name: "Bastidas",                 lat: 11.2550, lng: -74.2050 },
                        { id: "s08", name: "Taganga",                  lat: 11.2680, lng: -74.1880 },
                        { id: "s09", name: "Gaira",                    lat: 11.1980, lng: -74.2200 },
                        { id: "s10", name: "El Rodadero",              lat: 11.2090, lng: -74.2280 }
                      ],
                      "route_stops": [
                        { route_id: "03", stop_id: "s01", order: 1 },
                        { route_id: "03", stop_id: "s02", order: 2 },
                        { route_id: "03", stop_id: "s03", order: 3 },
                        { route_id: "03", stop_id: "s04", order: 4 },
                        { route_id: "03", stop_id: "s05", order: 5 },
                        { route_id: "03", stop_id: "s06", order: 6 },
                        { route_id: "11", stop_id: "s01", order: 1 },
                        { route_id: "11", stop_id: "s03", order: 2 },
                        { route_id: "11", stop_id: "s07", order: 3 },
                        { route_id: "11", stop_id: "s08", order: 4 },
                        { route_id: "16", stop_id: "s09", order: 1 },
                        { route_id: "16", stop_id: "s10", order: 2 },
                        { route_id: "16", stop_id: "s04", order: 3 },
                        { route_id: "16", stop_id: "s06", order: 4 }
                      ],
                      "buses": [
                        { id: "b01", route_id: "03", current_stop_index: 1, eta_to_next_stop_seconds: 240, status: "en_ruta" },
                        { id: "b02", route_id: "03", current_stop_index: 3, eta_to_next_stop_seconds: 120, status: "en_ruta" },
                        { id: "b03", route_id: "11", current_stop_index: 0, eta_to_next_stop_seconds: 360, status: "en_ruta" },
                        { id: "b04", route_id: "16", current_stop_index: 1, eta_to_next_stop_seconds: 600, status: "demorado" }
                      ]
                    }
  README.md
```

### 8.2 Estructura de `supabase/migrations/`

```
supabase/migrations/
  0001_init_catalog.sql       ← Fase 1: routes + stops + route_stops + _migrations
  0002_init_buses.sql         ← Fase 1: buses
  0003_init_favorites.sql     ← Fase 1: favorites
  0004_enable_realtime.sql    ← Fase 1: ALTER PUBLICATION supabase_realtime ADD TABLE buses
```

---

## 9. Modelo de datos — Supabase Postgres

### Migration `0001_init_catalog.sql`

```sql
CREATE TABLE IF NOT EXISTS _migrations (
  id         SERIAL       PRIMARY KEY,
  filename   VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
  id    VARCHAR(5)   PRIMARY KEY,            -- "03", "11", "16"
  name  VARCHAR(100) NOT NULL,
  color VARCHAR(7)   NOT NULL                 -- "#2563EB"
);

CREATE TABLE IF NOT EXISTS stops (
  id        VARCHAR(10)   PRIMARY KEY,        -- "s01", "s02", ...
  name      VARCHAR(150)  NOT NULL,
  latitude  DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL
);

CREATE TABLE IF NOT EXISTS route_stops (
  route_id   VARCHAR(5)  REFERENCES routes(id) ON DELETE CASCADE,
  stop_id    VARCHAR(10) REFERENCES stops(id) ON DELETE CASCADE,
  stop_order INTEGER     NOT NULL,
  PRIMARY KEY (route_id, stop_id)
);

CREATE INDEX IF NOT EXISTS idx_route_stops_order ON route_stops(route_id, stop_order);
```

### Migration `0002_init_buses.sql`

```sql
CREATE TABLE IF NOT EXISTS buses (
  id                       VARCHAR(10)   PRIMARY KEY,
  route_id                 VARCHAR(5)    NOT NULL REFERENCES routes(id),
  current_stop_index       INTEGER       NOT NULL DEFAULT 0,
  eta_to_next_stop_seconds INTEGER       NOT NULL DEFAULT 300 CHECK (eta_to_next_stop_seconds >= 0),
  status                   VARCHAR(20)   NOT NULL DEFAULT 'en_ruta'
                           CHECK (status IN ('en_ruta', 'demorado', 'fuera_de_servicio')),
  -- Coordenadas calculadas (interpoladas) — actualizadas por el cron
  current_lat              DECIMAL(10,7),
  current_lng              DECIMAL(10,7),
  updated_at               TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buses_route ON buses(route_id, status);
```

### Migration `0003_init_favorites.sql`

```sql
CREATE TABLE IF NOT EXISTS favorites (
  id        UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id VARCHAR(64)  NOT NULL,
  route_id  VARCHAR(5)   NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  saved_at  TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE (device_id, route_id)               -- RN-05
);

CREATE INDEX IF NOT EXISTS idx_favorites_device ON favorites(device_id);
```

### Migration `0004_enable_realtime.sql`

```sql
-- Habilita Supabase Realtime para la tabla buses.
-- Cualquier cliente suscrito recibirá los cambios automáticamente.
ALTER PUBLICATION supabase_realtime ADD TABLE buses;
```

---

## 10. Capa de datos unificada

`lib/dataService.ts` es el **único punto de acceso a datos en el servidor**.

```typescript
// Sistema
export async function getSystemMode(): Promise<'seed' | 'live'>

// Catálogo (lectura — cacheable, no realtime)
export async function getRoutes(): Promise<Route[]>
export async function getStops(): Promise<Stop[]>
export async function getRouteStops(routeId: string): Promise<Stop[]>  // ordenadas por stop_order
export async function getNearbyStops(lat: number, lng: number, limit?: number): Promise<NearbyStop[]>

// Buses (lectura inicial — luego se actualizan vía Realtime en el cliente)
export async function getActiveBuses(): Promise<Bus[]>
export async function getBusById(id: string): Promise<BusWithRoute | null>

// Favoritos
export async function getFavorites(deviceId: string): Promise<Route[]>
export async function addFavorite(deviceId: string, routeId: string): Promise<Favorite>
export async function removeFavorite(deviceId: string, routeId: string): Promise<void>

// Simulación (solo se llama desde el cron)
export async function simulateBusesTick(): Promise<{ updated: number }>
```

> **Importante:** el cliente (`'use client'`) NO llama a `dataService`. Para datos en tiempo real usa el `@supabase/supabase-js` client directamente con `.subscribe()`. Para datos estáticos hace fetch a las API routes.

---

## 11. Simulación de buses (Vercel Cron)

### `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/simulate",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

> Vercel Cron en plan Hobby corre cada minuto como mínimo. Esto es suficiente para el prototipo.

### `app/api/cron/simulate/route.ts`

```typescript
// Verifica el header Authorization === Bearer ${CRON_SECRET}
// Llama a dataService.simulateBusesTick()
// Retorna { updated: N }
```

### Lógica de `simulateBusesTick()` en `dataService`

```typescript
export async function simulateBusesTick(): Promise<{ updated: number }> {
  const buses = await getActiveBuses();
  const SECONDS_PER_TICK = 60;        // el cron corre cada 60 segundos
  const SECONDS_BETWEEN_STOPS = 300;  // 5 minutos entre paradas

  for (const bus of buses) {
    const route = await getRouteStops(bus.route_id);
    let newStopIndex = bus.current_stop_index;
    let newEta = bus.eta_to_next_stop_seconds - SECONDS_PER_TICK;

    if (newEta <= 0) {
      // El bus llegó a la próxima parada → avanza
      newStopIndex = (newStopIndex + 1) % route.length;
      newEta = SECONDS_BETWEEN_STOPS;
    }

    // Calcular posición interpolada entre la parada actual y la siguiente
    const currentStop = route[newStopIndex];
    const nextStop   = route[(newStopIndex + 1) % route.length];
    const progress   = 1 - (newEta / SECONDS_BETWEEN_STOPS);
    const lat = currentStop.latitude  + (nextStop.latitude  - currentStop.latitude)  * progress;
    const lng = currentStop.longitude + (nextStop.longitude - currentStop.longitude) * progress;

    await supabase.from('buses').update({
      current_stop_index: newStopIndex,
      eta_to_next_stop_seconds: newEta,
      current_lat: lat,
      current_lng: lng,
      updated_at: new Date().toISOString(),
    }).eq('id', bus.id);
  }

  return { updated: buses.length };
}
```

---

## 12. Suscripción a Realtime en el cliente

### Hook `useBusSubscription()` (compartido, en `lib/hooks/useBusSubscription.ts`)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export function useBusSubscription() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // 1. Lectura inicial
    supabase.from('buses').select('*').eq('status', 'en_ruta').then(({ data }) => {
      if (data) setBuses(data);
    });

    // 2. Suscripción a cambios
    const channel = supabase
      .channel('buses-changes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'buses' },
        (payload) => {
          setBuses((prev) =>
            prev.map(b => b.id === payload.new.id ? payload.new : b)
          );
        })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, []);

  return buses;
}
```

### Hook `useETACountdown()` para el countdown visual cada segundo

```typescript
export function useETACountdown(initialEta: number, updatedAt: Date) {
  const [eta, setEta] = useState(initialEta);

  useEffect(() => {
    setEta(initialEta);  // resetea cuando llega un nuevo dato del servidor

    const interval = setInterval(() => {
      const elapsed = (Date.now() - updatedAt.getTime()) / 1000;
      setEta(Math.max(0, initialEta - elapsed));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialEta, updatedAt]);

  return Math.round(eta);
}
```

---

## 13. Identidad de dispositivo y favoritos

### `lib/deviceId.ts` (cliente)

```typescript
'use client';

const KEY = 'setp_device_id';

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
```

Los endpoints de favoritos reciben el `deviceId` en el body o en un header custom `X-Device-Id`. No requieren cookie ni JWT — la app es completamente pública.

---

## 14. Arquitectura de rutas

### Estructura de carpetas (App Router)

```
app/
  layout.tsx                       ← Configuración de fuentes, Tailwind
  globals.css                      ← Variables CSS del design system
  page.tsx                         ← Splash + decisor de onboarding (Stream C)

  onboarding/page.tsx              ← Stream C
  permission/page.tsx              ← Stream C

  (tabs)/                          ← Layout group con bottom nav
    layout.tsx                     ← BottomNav (FUNDACIÓN)
    map/page.tsx                   ← Stream A: HomeScreen
    routes/
      page.tsx                     ← Stream B: PlannerScreen
      results/page.tsx             ← Stream B: PlannerResultsScreen
      trip/page.tsx                ← Stream B: TripDetailScreen
    favorites/page.tsx             ← Stream C: FavoritesScreen

  stops/
    page.tsx                       ← Stream C: NearbyStopsScreen
    [id]/page.tsx                  ← Stream C: StopDetailScreen

  admin/
    db-setup/page.tsx              ← FUNDACIÓN

  api/
    system/bootstrap | diagnose | mode    ← FUNDACIÓN
    cron/simulate/route.ts                 ← FUNDACIÓN (cron)
    routes/route.ts                        ← FUNDACIÓN
    stops/route.ts                         ← FUNDACIÓN
    stops/nearby/route.ts                  ← Stream C
    buses/route.ts                         ← FUNDACIÓN (lectura inicial)
    favorites/route.ts                     ← Stream C

components/
  ui/                              ← FUNDACIÓN: Button, Input, Toast, Sheet
  shared/                          ← FUNDACIÓN: RouteChip, ETABadge, BusCard, StopListItem
  layout/                          ← FUNDACIÓN: BottomNav, OfflineBanner

  map/                             ← STREAM A (Pedro)
    MapView.tsx
    BusMarker.tsx
    UserMarker.tsx
    RoutePolyline.tsx
    BusBottomSheet.tsx

  planner/                         ← STREAM B (Sebastián)
    PlannerForm.tsx
    StopAutocomplete.tsx
    TripOptionCard.tsx
    AlertBottomSheet.tsx

  discovery/                       ← STREAM C (Richard)
    OnboardingSlides.tsx
    NearbyStopsList.tsx
    FavoriteRouteCard.tsx
    StopMap.tsx

lib/
  supabase.ts                      ← FUNDACIÓN: server-side client
  supabase-client.ts               ← FUNDACIÓN: client-side client (para Realtime)
  dataService.ts                   ← FUNDACIÓN
  pgMigrate.ts                     ← FUNDACIÓN
  seedReader.ts                    ← FUNDACIÓN
  busSimulation.ts                 ← FUNDACIÓN
  deviceId.ts                      ← FUNDACIÓN
  types.ts                         ← FUNDACIÓN
  schemas.ts                       ← FUNDACIÓN
  design/
    colors.ts                      ← FUNDACIÓN
    typography.ts                  ← FUNDACIÓN
    spacing.ts                     ← FUNDACIÓN
  hooks/
    useBusSubscription.ts          ← STREAM A (Pedro)
    useETACountdown.ts             ← STREAM A (Pedro)
    useNetworkStatus.ts            ← STREAM C (Richard)
    useDeviceId.ts                 ← FUNDACIÓN
```

---

## 15. Sistema de diseño

### Paleta (variables CSS en `globals.css`)

```css
:root {
  --color-primary: #0D2B55;
  --color-primary-light: #1E4080;
  --color-accent: #F5C518;
  --color-bg: #F8F9FA;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #6B7280;
  --color-border: #E2E8F0;
  --color-success: #22C55E;
  --color-warning: #F97316;
  --color-error: #EF4444;
  --color-ruta-03: #2563EB;   /* Mamatoco – Centro */
  --color-ruta-11: #16A34A;   /* Bastidas – Taganga */
  --color-ruta-16: #DC2626;   /* Gaira – El Rodadero */
  --color-offline-bg: #FEF3C7;
  --color-offline-text: #92400E;
}
```

### Tipografía

| Rol | Fuente | Peso | Tamaño |
|---|---|---|---|
| Display | Plus Jakarta Sans | 700 | 24–28px |
| Título de pantalla | Plus Jakarta Sans | 600 | 20–22px |
| ETA grande | Plus Jakarta Sans | 700 | 22px |
| Cuerpo | DM Sans | 400 | 15–16px |
| Cuerpo pequeño | DM Sans | 400 | 13–14px |
| Botón | DM Sans | 500 | 15px |

Cargadas con `next/font/google` (Plus_Jakarta_Sans + DM_Sans) en el layout raíz.

### Bottom Sheet en web (Framer Motion)

Componente custom `<Sheet>` en `components/ui/Sheet.tsx`:
- Overlay semitransparente al fondo (`bg-black/30`)
- Panel deslizable desde abajo con `motion.div`, `drag="y"`, `dragConstraints`
- Snap points configurables (ej: `[280, 400]`)
- Cerrable arrastrando hacia abajo o tocando el overlay
- Border radius `20px 20px 0 0` y sombra `0 -4px 24px rgba(0,0,0,0.12)`

---

## 16. Inventario de pantallas y propiedad por stream

| ID Spec | Pantalla | Ruta Next.js | Stream | Responsable |
|---|---|---|---|---|
| S-01 | Splash | `/` | C | Richard |
| S-02 | Onboarding | `/onboarding` | C | Richard |
| S-03 | Permiso ubicación | `/permission` | C | Richard |
| **S-04** | **Mapa principal** | `/(tabs)/map` | **A** | **Pedro** |
| **S-05** | **Panel de bus (sheet)** | overlay en `/map` | **A** | **Pedro** |
| S-06 | Planificador | `/(tabs)/routes` | B | Sebastián |
| S-07 | Resultados | `/(tabs)/routes/results` | B | Sebastián |
| S-08 | Detalle de viaje | `/(tabs)/routes/trip` | B | Sebastián |
| S-09 | Paradas cercanas | `/stops` | C | Richard |
| S-10 | Detalle de parada | `/stops/[id]` | C | Richard |
| S-11 | Favoritos | `/(tabs)/favorites` | C | Richard |
| S-12 | Configurar alerta | overlay en `/trip` | B | Sebastián |
| S-13 | Banner offline | global, en BottomNav | A/C | Compartido |

---

## 17. Stream A — Mapa y tiempo real (Pedro)

### Archivos exclusivos
```
app/(tabs)/map/page.tsx
components/map/MapView.tsx
components/map/BusMarker.tsx
components/map/UserMarker.tsx
components/map/RoutePolyline.tsx
components/map/BusBottomSheet.tsx
lib/hooks/useBusSubscription.ts
lib/hooks/useETACountdown.ts
```

### Vista (`/(tabs)/map/page.tsx`) — `'use client'`

- `MapView` ocupa toda la pantalla, centrada en Universidad Sergio Arboleda
- Buses en tiempo real vía `useBusSubscription()` — cada uno como `BusMarker` con animación suave entre posiciones (Framer Motion `layoutId`)
- Posición del usuario (geolocation API) con anillo pulsante
- Polylines de las rutas (color de cada ruta)
- Sheet colapsado en la parte inferior con paradas cercanas (consume `getNearbyStops()`)
- Barra de búsqueda flotante en la parte superior → al tocar navega a `/(tabs)/routes`
- Al tocar un bus → abre `BusBottomSheet` con sus datos

### `BusBottomSheet` (S-05)
- Sheet con snap point único (280dp)
- Chip de ruta + estado
- ETA grande con `useETACountdown` para countdown visual cada segundo
- Botones "Seguir este bus" / "Ver ruta"

---

## 18. Stream B — Planificador (Sebastián)

### Archivos exclusivos
```
app/(tabs)/routes/page.tsx
app/(tabs)/routes/results/page.tsx
app/(tabs)/routes/trip/page.tsx
components/planner/PlannerForm.tsx
components/planner/StopAutocomplete.tsx
components/planner/TripOptionCard.tsx
components/planner/AlertBottomSheet.tsx
```

### `/(tabs)/routes` (S-06)
- `PlannerForm` con dos `StopAutocomplete` (origen punto azul, destino punto rojo)
- Botón ⇅ para intercambiar
- 4 sugerencias rápidas (USA, Rodadero, Hospital, Mercado)
- Al confirmar → navegar a `/results?from=X&to=Y`

### `/(tabs)/routes/results` (S-07)
- Server component que recibe `from` y `to` como query params
- Renderiza dos `TripOptionCard` (datos hardcoded para el prototipo)
- Al tocar una opción → `/trip?option=1`

### `/(tabs)/routes/trip` (S-08)
- Mapa pequeño con polyline azul de la Ruta 03
- Lista de paradas intermedias scrollable
- Botón "🔔 Activarme cuando el bus llegue" → abre `AlertBottomSheet`

### `AlertBottomSheet` (S-12)
- Selector de chips [5 / 10 / 15 min]
- Toggle "Solo para el próximo bus"
- Botón "Activar alerta" → toast de confirmación

---

## 19. Stream C — Descubrimiento, Favoritos y Onboarding (Richard)

### Archivos exclusivos
```
app/page.tsx                        (splash + decisor)
app/onboarding/page.tsx
app/permission/page.tsx
app/stops/page.tsx
app/stops/[id]/page.tsx
app/(tabs)/favorites/page.tsx
app/api/stops/nearby/route.ts
app/api/favorites/route.ts
components/discovery/OnboardingSlides.tsx
components/discovery/NearbyStopsList.tsx
components/discovery/FavoriteRouteCard.tsx
components/discovery/StopMap.tsx
lib/hooks/useNetworkStatus.ts
```

### `/` (S-01 + decisor)
- Renderizado en cliente
- Si `localStorage.getItem('setp_onboarding_done')` existe → redirect a `/(tabs)/map`
- Si no → muestra splash 1.5s y redirect a `/onboarding`

### `/onboarding` (S-02)
- Slider horizontal con 3 slides (Framer Motion + drag)
- Al completar → `localStorage.setItem('setp_onboarding_done', 'true')` y navega a `/permission`

### `/permission` (S-03)
- Botón "Activar ubicación" → llama `navigator.geolocation.getCurrentPosition()`
- Independientemente del resultado → navega a `/(tabs)/map`

### `/stops` (S-09)
- Llama a `/api/stops/nearby?lat=X&lng=Y&limit=10`
- Renderiza lista de `StopListItem`
- Al tocar → navegar a `/stops/[id]`

### `/stops/[id]` (S-10)
- `StopMap` con marcador de la parada
- Lista de buses con ETA en tiempo real (suscripción Realtime)

### `/(tabs)/favorites` (S-11)
- Lee `device_id` con `useDeviceId` y pide `/api/favorites?deviceId=X`
- Si vacío: empty state motivador
- Si hay: lista de `FavoriteRouteCard`

### Endpoints
- `GET /api/stops/nearby?lat=&lng=&limit=` — calcula distancia haversine
- `GET /api/favorites?deviceId=` — lista de favoritos
- `POST /api/favorites` body `{ deviceId, routeId }` — agrega favorito
- `DELETE /api/favorites?deviceId=&routeId=` — elimina favorito

### `useNetworkStatus`
- Hook con `window.addEventListener('online'|'offline')`
- Expone `{ isOnline: boolean, lastOnlineAt: Date }`

---

## 20. Plan de trabajo y protocolo sin conflictos

### Fase 0 — Fundación (TODO el equipo, antes de los streams · 1 día)

**Tareas:**
1. Crear proyecto Next.js + instalar dependencias (Pedro)
2. Configurar Tailwind, fuentes y design tokens (Sebastián)
3. Crear migrations 0001–0004 y `data/seed.json` (Richard)
4. Implementar `lib/supabase.ts`, `lib/supabase-client.ts`, `lib/dataService.ts` (Pedro)
5. Implementar `lib/busSimulation.ts` y `app/api/cron/simulate/route.ts` (Pedro)
6. Implementar componentes compartidos: `Button`, `Input`, `Sheet`, `RouteChip`, `ETABadge`, `BusCard`, `StopListItem`, `BottomNav`, `OfflineBanner` (Sebastián)
7. Implementar `lib/deviceId.ts` y `lib/hooks/useDeviceId.ts` (Richard)
8. Crear `app/(tabs)/layout.tsx` con BottomNav y stubs de cada tab (Richard)
9. Crear `app/admin/db-setup/page.tsx` (Pedro)
10. Configurar `vercel.json` con el cron (Pedro)
11. Commit a `main` y notificar al equipo

### Fase 1 — Streams paralelos (cada uno en su branch · 3-4 días)

```
main
├── feat/stream-a-mapa            (Pedro)
├── feat/stream-b-planificador    (Sebastián)
└── feat/stream-c-discovery       (Richard)
```

### Fase 2 — Integración (1 día)

Merge en orden: **C → B → A** (de menor a mayor dependencia con tiempo real).
Pull request con revisión cruzada (10 min por PR).

### Reglas de oro

1. **Solo escribes en tu carpeta de stream.**
2. **Todo lo de Fundación es de solo lectura** durante los streams.
3. **Si encuentras un bug en Fundación:** abrir Issue, no arreglar en tu PR.
4. **Antes de mergear:** `git pull origin main` en tu branch.
5. **Commits diarios** en cada branch.

### Mapa de propiedad de archivos

| Carpeta / Archivo | Quién escribe |
|---|---|
| `app/(tabs)/map/*`, `components/map/*` | Solo Pedro |
| `app/(tabs)/routes/*`, `components/planner/*` | Solo Sebastián |
| `app/onboarding/*`, `app/permission/*`, `app/stops/*`, `app/(tabs)/favorites/*`, `components/discovery/*` | Solo Richard |
| `lib/hooks/useBusSubscription.ts`, `useETACountdown.ts` | Pedro |
| `lib/hooks/useNetworkStatus.ts` | Richard |
| `app/api/stops/nearby/route.ts`, `app/api/favorites/route.ts` | Richard |
| Todo lo demás | Fundación — solo lectura |

---

## 21. Glosario

| Término | Definición |
|---|---|
| **SETP** | Sistema Estratégico de Transporte Público de Santa Marta. |
| **SGCF** | Sistema de Gestión y Control de Flota — el backend operativo real del SETP (Decreto 3422/2009). Este prototipo NO se conecta al SGCF. |
| **Device ID** | UUID único por dispositivo, generado en el primer uso y guardado en localStorage. Vincula los favoritos. |
| **Cron tick** | Ejecución del endpoint `/api/cron/simulate` cada minuto. Actualiza la posición de los buses. |
| **Realtime** | Característica de Supabase que propaga cambios de Postgres a los clientes suscritos vía WebSocket. |
| **ETA countdown** | Decremento del ETA en el cliente cada segundo entre actualizaciones del servidor. Es solo visual. |
| **Stream** | Bloque de trabajo asignado a un integrante del equipo. A=Mapa, B=Planificador, C=Descubrimiento. |
| **Bootstrap** | Aplicar migrations + cargar seed en Supabase. Solo lo hace el admin técnico una vez. |
| **dataService** | Único punto de acceso a datos en el servidor. |

---

> Última actualización: Mayo 2026
> Pedro José Jiménez · Sebastián Quintero · Richard Díaz
> Diseño Digital — Universidad Sergio Arboleda, Santa Marta
