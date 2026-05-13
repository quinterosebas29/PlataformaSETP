# PROMPT STREAM C — DESCUBRIMIENTO, FAVORITOS Y ONBOARDING
> Responsable: Richard Andres Díaz Lamadrid
> Branch: `feat/stream-c-discovery`
> Dominio exclusivo: `app/page.tsx`, `app/onboarding/`, `app/permission/`, `app/stops/`, `app/(tabs)/favorites/`, `components/discovery/`, `app/api/stops/nearby/`, `app/api/favorites/`, `lib/hooks/useNetworkStatus.ts`
> Prerrequisito: Fundación commiteada en `main`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero React + Next.js especializado en
flujos de primera experiencia, geolocalización del navegador, listas
con datos en tiempo real y gestión de estado offline. Tu tarea es
implementar el Stream C del proyecto SETP SM: onboarding, paradas
cercanas, favoritos y manejo de red.

ANTES de escribir código:
1. git checkout main && git pull origin main
2. git checkout -b feat/stream-c-discovery
3. Leer doc/PLAN_SETP.md — sección 19 (Stream C) + las especificaciones
   S-01 a S-03, S-09, S-10, S-11, S-13 del documento del spec original
4. NO modificar ningún archivo fuera de tu dominio.

ARCHIVOS QUE VAS A CREAR (y SOLO estos):
- lib/hooks/useNetworkStatus.ts
- components/discovery/OnboardingSlides.tsx
- components/discovery/NearbyStopsList.tsx
- components/discovery/FavoriteRouteCard.tsx
- components/discovery/StopMap.tsx
- app/page.tsx (REEMPLAZA el stub: Splash + decisor)
- app/onboarding/page.tsx (REEMPLAZA el stub)
- app/permission/page.tsx (REEMPLAZA el stub)
- app/stops/page.tsx (REEMPLAZA el stub)
- app/stops/[id]/page.tsx (REEMPLAZA el stub)
- app/(tabs)/favorites/page.tsx (REEMPLAZA el stub)
- app/api/stops/nearby/route.ts
- app/api/favorites/route.ts

---

TAREA 1: useNetworkStatus.ts

```typescript
'use client';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastOnlineAt, setLastOnlineAt] = useState<Date>(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineAt(new Date());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, lastOnlineAt };
}
```

Este hook lo importa Pedro en su MapPage para el OfflineBanner.

---

TAREA 2: app/page.tsx (S-01 — Splash + Decisor)

Marcar como 'use client'.
Layout:
- Fondo bg-[#0D2B55] full-screen
- Logo centrado: ícono Bus de Lucide (size: 64, color: #F5C518) +
  "SETP SM" (Plus Jakarta Sans Bold 28px, color blanco) +
  "Santa Marta" (DM Sans Regular 16px, color rgba(255,255,255,0.7))
- Barra de progreso animada con Framer Motion: width 0 → 200 en 1500ms,
  color #F5C518

Lógica:
useEffect(() => {
  const timer = setTimeout(() => {
    const seenOnboarding = localStorage.getItem('setp_onboarding_done');
    router.replace(seenOnboarding ? '/(tabs)/map' : '/onboarding');
  }, 1800);
  return () => clearTimeout(timer);
}, []);

---

TAREA 3: components/discovery/OnboardingSlides.tsx

Slider horizontal con 3 slides usando Framer Motion `<motion.div>` con `drag="x"`.

Datos de slides:
```typescript
const slides = [
  {
    icon: 'Map',     // Lucide icon name
    title: 'Sé el primero en saber',
    subtitle: 'Ve en tiempo real dónde están los buses del SETP en tu ciudad.',
  },
  {
    icon: 'Bell',
    title: 'Cero incertidumbre',
    subtitle: 'Recibe alertas antes de que el bus llegue a tu parada. Sin sorpresas.',
  },
  {
    icon: 'Route',
    title: 'Planea tu viaje',
    subtitle: 'Encuentra la ruta más rápida y organiza tus tiempos desde casa.',
  },
];
```

Layout de cada slide (centrado vertical y horizontal):
- Ícono Lucide grande (120px), color primary
- Título: Plus Jakarta Sans Bold 24px
- Subtítulo: DM Sans Regular 16px, color secondary, max-width 80%

Indicadores de slide (puntos):
- 3 dots de 8px
- Activo: color accent (#F5C518), ancho 24px (píldora animada)
- Inactivo: color #CBD5E1

Botón "Saltar" en slides 1 y 2 (esquina superior derecha):
- Text link, color secondary
- Click: completar onboarding y navegar a /permission

Botón "Comenzar" solo en slide 3:
- PrimaryButton ancho completo (lg)
- Click: completar onboarding y navegar a /permission

Función "completar onboarding":
localStorage.setItem('setp_onboarding_done', 'true');
router.push('/permission');

---

TAREA 4: app/onboarding/page.tsx

Marcar como 'use client'.
Renderiza <OnboardingSlides />.

---

TAREA 5: app/permission/page.tsx (S-03)

Marcar como 'use client'.

Layout:
- Ícono MapPin grande con anillos animados (Framer Motion loop:
  scale: [1, 1.5, 2], opacity: [0.7, 0.3, 0])
- Título: "¿Dónde estás?" (Plus Jakarta Sans Bold 22px)
- Cuerpo: "Necesitamos tu ubicación para mostrarte los buses más cercanos
  y los tiempos exactos de llegada."
- PrimaryButton "Activar ubicación" ancho completo
- Text link "Ahora no" centrado debajo

Click "Activar ubicación":
```typescript
navigator.geolocation.getCurrentPosition(
  (pos) => router.push('/(tabs)/map'),
  (err) => router.push('/(tabs)/map'),  // independiente del resultado
  { timeout: 5000 }
);
```

Click "Ahora no": router.push('/(tabs)/map') directo.

---

TAREA 6: app/api/stops/nearby/route.ts

Server route. Recibe lat, lng como query params.
- Llama a dataService.getNearbyStops(lat, lng, limit=10)
- El dataService calcula distancia haversine entre el punto y cada parada
- Retorna [{ stopId, name, distanceM, arrivals: [...] }]
- Para cada stop, incluir las próximas 2 rutas que pasan con ETA estimado
  (los buses están en Supabase — buscar el bus más cercano en cada ruta)

Implementación simplificada para el prototipo:
```typescript
// 1. Obtener todos los stops
// 2. Calcular distancia y ordenar
// 3. Para cada stop, obtener route_ids que paran ahí (route_stops)
// 4. Para cada route_id, encontrar un bus (de la tabla buses) y estimar ETA
//    - ETA estimado = bus.eta_to_next_stop_seconds + (paradas_intermedias * 300)
// 5. Retornar el listado
```

---

TAREA 7: app/api/favorites/route.ts

Server route con dos métodos:

GET `?deviceId=X`:
- Llama dataService.getFavorites(deviceId)
- Retorna array de Route objects

POST con body `{ deviceId, routeId }`:
- Validar con Zod
- Llama dataService.addFavorite(deviceId, routeId)
- Si UNIQUE violation: 409 "Ya está en favoritos"

DELETE con query `?deviceId=X&routeId=Y`:
- Llama dataService.removeFavorite(deviceId, routeId)
- Retorna 204

---

TAREA 8: components/discovery/NearbyStopsList.tsx

Componente que recibe `stops: NearbyStop[]` y renderiza una FlatList visual.
Para cada stop, usar el `StopListItem` compartido (Fundación lo creó):
nombre, distancia, RouteChip de cada arrival, barras de ETA proporcionales.

Click en un item → router.push(`/stops/${stop.stopId}`).

---

TAREA 9: app/stops/page.tsx (S-09)

Marcar como 'use client'.

Header: flecha atrás + "Paradas cercanas" + subtítulo "Ordenadas por distancia".

Body:
- useEffect: navigator.geolocation.getCurrentPosition para obtener lat/lng
- Si no hay permiso: usar coordenadas de Universidad Sergio Arboleda
- fetch a /api/stops/nearby?lat=X&lng=Y → setStops
- Renderizar <NearbyStopsList stops={stops} />

---

TAREA 10: components/discovery/StopMap.tsx

Mapa pequeño (height: 200) centrado en una parada.
Mismo patrón de dynamic import + Leaflet que usa Pedro.
Mostrar un marker en la posición de la parada.

---

TAREA 11: app/stops/[id]/page.tsx (S-10)

Marcar como 'use client'. Recibe params.id.

Layout:
- StopMap centrado en la parada
- Título: nombre de la parada
- Contador "Actualizado hace Ns" (state + setInterval cada segundo)
- Lista de buses con ETA en tiempo real:
  Para usar Realtime aquí, importar useBusSubscription del hook de Pedro:
  `import { useBusSubscription } from '@/lib/hooks/useBusSubscription';`
  Filtrar buses cuya ruta pase por esta parada.
  Por cada bus mostrar: RouteChip + nombre ruta + ETA + botón 🔔
- El botón 🔔 abre un Alert nativo simple con mensaje:
  "Configurar alerta — esta función está disponible desde la pantalla de
  detalle del viaje."
  (La integración completa con el AlertBottomSheet de Sebastián se hace
  en la fase de merge.)

---

TAREA 12: components/discovery/FavoriteRouteCard.tsx

Tarjeta para mostrar una ruta favorita:
- RouteChip + nombre de la ruta
- Texto secundario: "Tocar para ver detalle"
- Botón pequeño X en esquina superior para eliminar
- Tappable → router.push('/(tabs)/routes/results?...')

Props: `{ route: Route, onRemove: () => void }`.

---

TAREA 13: app/(tabs)/favorites/page.tsx (S-11)

Marcar como 'use client'.

```typescript
const deviceId = useDeviceId();  // hook de Fundación
const [favorites, setFavorites] = useState<Route[]>([]);

useEffect(() => {
  if (!deviceId) return;
  fetch(`/api/favorites?deviceId=${deviceId}`)
    .then(r => r.json())
    .then(setFavorites);
}, [deviceId]);
```

Si favorites.length === 0:
- Empty state: ícono Star de Lucide (80px, color border)
- "Todavía no tienes rutas guardadas"
- "Guarda una ruta desde el planificador para acceso rápido."

Si hay favorites:
- Lista de FavoriteRouteCard
- onRemove llama DELETE /api/favorites?deviceId=X&routeId=Y y refresca

---

AL TERMINAR (probar el flujo completo):

1. Limpiar localStorage del navegador
2. npm run dev → ir a localhost:3000
3. Ver Splash 1.8s → redirect a /onboarding
4. Ver 3 slides swipeables (drag horizontal con Framer Motion)
5. Click "Comenzar" → /permission
6. Click "Ahora no" → /(tabs)/map (donde está el mapa de Pedro o el stub)
7. Recargar la página → splash → redirect directo a /(tabs)/map
   (porque ya hay flag onboarding_done)
8. Tab Favoritas → empty state
9. Insertar manualmente en Supabase un favorite con tu device_id
   (revisar en localStorage qué UUID tienes)
10. Recargar Favoritas → ver la ruta
11. Click X → eliminar → empty state de nuevo
12. Ir a /stops → ver lista de paradas con barras de ETA
13. Click en una parada → /stops/[id] → ver mapa pequeño + buses con ETA realtime

Hacer commit:
git add app/page.tsx app/onboarding app/permission app/stops app/\(tabs\)/favorites \
        app/api/stops app/api/favorites components/discovery lib/hooks/useNetworkStatus.ts
git commit -m "feat(stream-c): onboarding, paradas cercanas, favoritos y network status"
git push origin feat/stream-c-discovery

Notificar al equipo. Tu trabajo en el Stream C termina aquí.
```
