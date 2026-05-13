# PROMPT STREAM A — MAPA Y TIEMPO REAL
> Responsable: Pedro José Jiménez Martínez
> Branch: `feat/stream-a-mapa`
> Dominio exclusivo: `app/(tabs)/map/`, `components/map/`, `lib/hooks/useBusSubscription.ts`, `lib/hooks/useETACountdown.ts`
> Prerrequisito: Fundación commiteada en `main`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero React + Next.js especializado en mapas
interactivos con Leaflet, suscripciones Realtime de Supabase, animaciones
con Framer Motion y bottom sheets. Tu tarea es implementar el Stream A
del proyecto SETP SM: la pantalla principal del mapa con buses en tiempo
real genuino.

ANTES de escribir código:
1. git checkout main && git pull origin main
2. git checkout -b feat/stream-a-mapa
3. Leer doc/PLAN_SETP.md — secciones 7 (arquitectura realtime), 12
   (suscripción en cliente con código completo) y 17 (Stream A)
4. NO modificar ningún archivo fuera de tu dominio.

ARCHIVOS QUE VAS A CREAR (y SOLO estos):
- lib/hooks/useBusSubscription.ts
- lib/hooks/useETACountdown.ts
- components/map/MapView.tsx
- components/map/BusMarker.tsx
- components/map/UserMarker.tsx
- components/map/RoutePolyline.tsx
- components/map/BusBottomSheet.tsx
- app/(tabs)/map/page.tsx (REEMPLAZA el stub)

---

TAREA 1: useBusSubscription.ts

```typescript
'use client';

// Conecta con Supabase Realtime para recibir cambios en la tabla buses.
// Lectura inicial vía REST + suscripción a UPDATE events.

export function useBusSubscription() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const supabase = createClient();  // de lib/supabase-client.ts

  useEffect(() => {
    // 1. Lectura inicial
    supabase.from('buses').select('*').in('status', ['en_ruta', 'demorado'])
      .then(({ data }) => { if (data) setBuses(data); });

    // 2. Suscripción a UPDATE events
    const channel = supabase
      .channel('buses-realtime')
      .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'buses' },
          (payload) => {
            setBuses(prev =>
              prev.map(b => b.id === payload.new.id ? payload.new as Bus : b)
            );
          })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, []);

  return buses;
}
```

---

TAREA 2: useETACountdown.ts

```typescript
'use client';

// Decrementa el ETA cada segundo en el cliente.
// Cuando el servidor envía un nuevo ETA, se resetea automáticamente.

export function useETACountdown(initialEta: number, updatedAt: string) {
  const [eta, setEta] = useState(initialEta);
  const updatedAtMs = new Date(updatedAt).getTime();

  useEffect(() => {
    setEta(initialEta);
    const interval = setInterval(() => {
      const elapsed = (Date.now() - updatedAtMs) / 1000;
      setEta(Math.max(0, initialEta - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, [initialEta, updatedAtMs]);

  return Math.round(eta);
}
```

---

TAREA 3: MapView.tsx

Wrapper de react-leaflet con configuración para el SETP:
- Centro inicial: [11.2310, -74.1950] (Universidad Sergio Arboleda)
- Zoom inicial: 14
- TileLayer de OpenStreetMap:
  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
- Hijos: children (UserMarker, BusMarker, RoutePolyline)

IMPORTANTE: Leaflet requiere que el componente sea cargado dinámicamente
para evitar SSR errors. Usar:
```typescript
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
```

Los íconos default de Leaflet también requieren un fix:
```typescript
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});
```
(O usar DivIcon custom para los buses, que es lo que vamos a hacer.)

---

TAREA 4: BusMarker.tsx

Marker custom con DivIcon de Leaflet:
- Renderiza un div con el chip [03] del color de la ruta
- Posicionado en bus.current_lat, bus.current_lng
- onClick: llama a la prop onSelect(busId)
- La transición visual entre posiciones la hace Leaflet automáticamente
  cuando cambia el `position` (smooth animation)

DivIcon HTML:
```html
<div class="bus-marker" style="background-color: ${routeColor}">
  ${routeId}
</div>
```

CSS:
```css
.bus-marker {
  padding: 4px 10px;
  border-radius: 6px;
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
```

---

TAREA 5: UserMarker.tsx

Marker en la posición del usuario con anillo pulsante.
Coordenadas: usar el state de geolocation (props o context).
Si no hay permiso de ubicación: posición default = Universidad Sergio Arboleda.

DivIcon con CSS animation:
```css
.user-pulse {
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  position: relative;
}
.user-pulse::before {
  content: '';
  position: absolute;
  top: -8px; left: -8px;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  opacity: 0.3;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.5); opacity: 0.7; }
  100% { transform: scale(1.5); opacity: 0; }
}
```

---

TAREA 6: RoutePolyline.tsx

Componente que recibe routeId y dibuja una Polyline conectando las
coordenadas de las paradas de esa ruta en orden.

```typescript
type Props = { routeId: string; stops: Stop[] };
// stops viene del server (passed as prop) — son las paradas de la ruta
// en orden por stop_order
```

Usa `<Polyline positions={stops.map(s => [s.latitude, s.longitude])}
  color={routeColor} weight={3} />`

---

TAREA 7: BusBottomSheet.tsx

Sheet que muestra info de un bus seleccionado.
Props: { bus: Bus | null, onClose: () => void }

Si bus es null: no renderiza nada.

Usa el `Sheet` compartido (de components/ui/Sheet.tsx — Fundación lo creó).
Layout siguiendo S-05:
- Handle pastilla
- RouteChip + estado (● En ruta verde / ● Demorado naranja)
- Subtítulo: nombre de la ruta
- ETA grande con useETACountdown (fórmula: convertir segundos a "X min")
- "Parada [próxima parada] · 80 m de ti"
- "Próxima parada: [stop name]"
- Dos botones: PrimaryButton "Seguir este bus" + OutlineButton "Ver ruta"

Para mostrar el ETA formateado:
```typescript
const seconds = useETACountdown(bus.eta_to_next_stop_seconds, bus.updated_at);
const minutes = Math.ceil(seconds / 60);
const display = minutes === 0 ? 'Llegando' : `${minutes} min`;
```

---

TAREA 8: app/(tabs)/map/page.tsx

REEMPLAZA el stub con la pantalla real. Marcar como 'use client'.

```typescript
'use client';

export default function MapPage() {
  const buses = useBusSubscription();
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeStopsMap, setRouteStopsMap] = useState<Record<string, Stop[]>>({});

  // En mount: cargar rutas y sus paradas vía /api/routes y /api/stops
  // (la fundación creó estos endpoints)

  const selectedBus = buses.find(b => b.id === selectedBusId);

  return (
    <div className="relative h-screen">
      <MapView>
        {/* Polylines de las rutas */}
        {routes.map(r => (
          <RoutePolyline key={r.id} routeId={r.id} stops={routeStopsMap[r.id] ?? []} />
        ))}

        {/* Posición del usuario */}
        <UserMarker />

        {/* Buses */}
        {buses.map(bus => (
          <BusMarker
            key={bus.id}
            bus={bus}
            onSelect={() => setSelectedBusId(bus.id)}
          />
        ))}
      </MapView>

      {/* Barra de búsqueda flotante en la parte superior */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <button
          onClick={() => router.push('/routes')}
          className="w-full bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3"
        >
          <SearchIcon />
          <span className="text-gray-400">¿A dónde vas hoy?</span>
        </button>
      </div>

      {/* Bus Bottom Sheet */}
      <BusBottomSheet
        bus={selectedBus ?? null}
        onClose={() => setSelectedBusId(null)}
      />
    </div>
  );
}
```

NOTA SOBRE PROPS DE STREAM C: Si quieres que el banner offline aparezca,
importa `OfflineBanner` desde components/layout/ (Fundación lo creó). Para
saber si está online, importa el hook que crea Richard:
`import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';`
Si Richard aún no lo terminó: usar `const isOnline = true;` temporalmente
y agregar el TODO en un comentario.

---

AL TERMINAR (PROBAR TODO ESTO):

1. npm run dev en local
2. Abrir localhost:3000/(tabs)/map en dos pestañas
3. En una terminal aparte, llamar al cron:
   curl -X POST http://localhost:3000/api/cron/simulate \
     -H "Authorization: Bearer ${CRON_SECRET}"
4. **CRÍTICO**: las dos pestañas deben mostrar los buses moverse
   simultáneamente — esto demuestra que Realtime funciona
5. Tocar un bus en el mapa → bottom sheet sube con sus datos
6. El countdown del ETA debe disminuir cada segundo en el cliente
7. La barra de búsqueda navega a /(tabs)/routes (aunque sea el stub de Sebastián)

Hacer commit:
git add app/\(tabs\)/map components/map lib/hooks/useBusSubscription.ts lib/hooks/useETACountdown.ts
git commit -m "feat(stream-a): mapa con buses en Realtime y bottom sheet"
git push origin feat/stream-a-mapa

Notificar al equipo. Tu trabajo en el Stream A termina aquí.
```
