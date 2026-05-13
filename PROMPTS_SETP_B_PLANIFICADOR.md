# PROMPT STREAM B — PLANIFICADOR DE VIAJES
> Responsable: Sebastián Andrés Quintero Sánchez
> Branch: `feat/stream-b-planificador`
> Dominio exclusivo: `app/(tabs)/routes/`, `components/planner/`
> Prerrequisito: Fundación commiteada en `main`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero React + Next.js especializado en
formularios de búsqueda con autocompletado, navegación con query params
en App Router, mapas con polylines y bottom sheets para configuración
rápida. Tu tarea es implementar el Stream B del proyecto SETP SM: el
planificador de viajes completo.

ANTES de escribir código:
1. git checkout main && git pull origin main
2. git checkout -b feat/stream-b-planificador
3. Leer doc/PLAN_SETP.md — sección 18 (Stream B) y la especificación
   original de S-06, S-07, S-08, S-12 en el documento del spec
4. NO modificar ningún archivo fuera de tu dominio.

ARCHIVOS QUE VAS A CREAR (y SOLO estos):
- components/planner/PlannerForm.tsx
- components/planner/StopAutocomplete.tsx
- components/planner/TripOptionCard.tsx
- components/planner/AlertBottomSheet.tsx
- app/(tabs)/routes/page.tsx (REEMPLAZA el stub)
- app/(tabs)/routes/results/page.tsx (REEMPLAZA el stub)
- app/(tabs)/routes/trip/page.tsx (REEMPLAZA el stub)

---

TAREA 1: StopAutocomplete.tsx

```typescript
'use client';

type Props = {
  label: string;          // "¿Desde dónde salís?" o "¿A dónde vas?"
  value: string;
  onChange: (value: string) => void;
  dotColor: string;       // '#2563EB' (azul) para origen, '#DC2626' para destino
};

// Input con dot a la izquierda + lista de sugerencias debajo cuando hay query
// Filtra STOPS (cargadas vía /api/stops) por nombre con .includes(toLowerCase)
// Máximo 5 resultados
// Al hacer click en una sugerencia: llama a onChange con stop.name
```

---

TAREA 2: PlannerForm.tsx

Form con dos `StopAutocomplete` apilados:
- Input 1: dot azul (#2563EB), placeholder "¿Desde dónde salís?", autoFocus
- Línea vertical punteada conectando los dos inputs
- Input 2: dot rojo (#DC2626), placeholder "¿A dónde vas?"
- Botón ⇅ (icono ArrowsUpDown de Lucide) entre los inputs para intercambiar
- Cuando ambos campos tienen texto: aparece PrimaryButton "Buscar rutas"
  que navega a `/routes/results?from=X&to=Y` (URL-encoded)

Al renderizar el form, también mostrar las sugerencias rápidas (cuando los
campos están vacíos):
```
Sugerencias:
  🏫 Universidad Sergio Arboleda
  🏖️ El Rodadero
  🏥 Hospital Central
  🛒 Mercado Público
```
Al hacer click en una: rellena el campo de destino.

---

TAREA 3: TripOptionCard.tsx

Tarjeta de opción de viaje:
```typescript
type Props = {
  isFastest?: boolean;
  routes: { id: string; color: string }[];  // chips a mostrar
  durationMin: number;
  transfers: number;
  nextDepartureMin: number;
  fromStop: string;
  onClick: () => void;
};
```

Layout:
- Badge "⭐ Más rápida" arriba si isFastest (fondo amarillo claro)
- Visual: chips de RouteChip + flechas → si hay más de uno
- Texto: "{durationMin} min · {transfers} transbordos"
- Texto: "Próxima salida: en {nextDepartureMin} min"
- Texto: "Sale desde: {fromStop}"
- Tarjeta tappable con sombra suave

---

TAREA 4: AlertBottomSheet.tsx

Sheet de configuración de alerta de llegada.
```typescript
type Props = {
  routeId: string;
  isOpen: boolean;
  onClose: () => void;
};
```

Usar el `Sheet` compartido (Fundación lo creó).
Snap point único: 280dp.

Layout siguiendo S-12:
- Handle pastilla
- "🔔 Alerta para Ruta {routeId}" (Plus Jakarta Sans SemiBold 17px)
- "Avisarme cuando el bus esté a:" (gris)
- Tres chips seleccionables: [5 min] [10 min] [15 min]
  Activo: bg primary, texto blanco
  Inactivo: borde gris, texto oscuro
  Default: 5 min activo
- Fila con toggle: "Solo para el próximo bus" + Switch (ON por defecto)
- Botón "Activar alerta" PrimaryButton ancho completo
  Al click: mostrar Toast (Fundación lo creó) "✅ Alerta activada para
  Ruta {routeId}" y cerrar el sheet con setTimeout 1500ms.

---

TAREA 5: app/(tabs)/routes/page.tsx (S-06)

Marcar como 'use client'.
Header con flecha atrás (router.back) + título "Planificar viaje".
Body: <PlannerForm />.

---

TAREA 6: app/(tabs)/routes/results/page.tsx (S-07)

Server component que recibe searchParams: `{ from?: string; to?: string }`.

Header:
- Flecha atrás
- Título: el destino (decoded del query param)
- Subtítulo: "Desde: {origen} · Ahora"

Body: dos TripOptionCard hardcoded (datos representativos del SETP):
```typescript
// Opción 1 (siempre la primera, isFastest=true):
{
  isFastest: true,
  routes: [{ id: '03', color: '#2563EB' }],
  durationMin: 22,
  transfers: 0,
  nextDepartureMin: 4,
  fromStop: 'Parada Mamatoco',
  onClick: () => router.push('/routes/trip?option=1'),
}

// Opción 2:
{
  isFastest: false,
  routes: [{ id: '11', color: '#16A34A' }, { id: '03', color: '#2563EB' }],
  durationMin: 35,
  transfers: 1,
  nextDepartureMin: 1,
  fromStop: 'Parada Gaira',
  onClick: () => router.push('/routes/trip?option=2'),
}
```

---

TAREA 7: app/(tabs)/routes/trip/page.tsx (S-08)

Marcar como 'use client' (porque hay AlertBottomSheet con state).
searchParams: `{ option: string }`.

Layout:
- Mapa pequeño en la mitad superior (height: 45vh)
  Usar dynamic import de MapContainer de react-leaflet (mismo patrón que
  Pedro usa, pero aquí no es realtime — solo muestra la polyline).
  Mostrar polyline azul gruesa (strokeWidth 5) conectando las coordenadas
  de las paradas de la Ruta 03.
  Marker verde en la primera parada, marker rojo en la última.
  Cargar las paradas con fetch a `/api/routes/03/stops` (si ese endpoint
  no existe, usa el de stops y filtra). Mejor: hardcoded las 6 paradas de
  la Ruta 03 desde el seed.

- Panel inferior con scroll:
  Resumen: RouteChip [03] + "22 min · Ruta 03 · 0 transbordos"
  
  Lista de paradas intermedias con timeline visual:
  ```
  🟢 Parada Mamatoco (salida)
  │  Estadio Sierra Nevada — 3 min
  │  Av. del Río — 6 min
  │  Centro Comercial — 10 min
  │  Catedral — 16 min
  🔴 Parada Terminal Centro — 22 min (llegada)
  ```
  La línea vertical entre los puntos es un border-left punteado.

  PrimaryButton: "🔔 Activarme cuando el bus llegue"
  Al click: setShowAlert(true) (state local).

- <AlertBottomSheet routeId="03" isOpen={showAlert} onClose={() => setShowAlert(false)} />

---

AL TERMINAR (probar el flujo completo):

1. npm run dev
2. Tab "Rutas" → ver PlannerForm
3. Escribir "Mama" en origen → ver "Parada Mamatoco" en sugerencias
4. Seleccionar → ver el campo rellenado
5. Tocar "El Rodadero" en sugerencias rápidas → rellena destino
6. Click "Buscar rutas" → /routes/results?from=Mamatoco&to=Rodadero
7. Ver dos TripOptionCard. Click en la primera (fastest)
8. /routes/trip?option=1 → ver mapa con polyline, paradas en lista
9. Click "🔔 Activarme..." → AlertBottomSheet sube
10. Cambiar entre 5/10/15 min → chip activo cambia visualmente
11. Toggle off/on
12. Click "Activar alerta" → toast verde y sheet baja

Hacer commit:
git add app/\(tabs\)/routes components/planner
git commit -m "feat(stream-b): planificador completo con resultados, detalle de viaje y alerta"
git push origin feat/stream-b-planificador

Notificar al equipo. Tu trabajo en el Stream B termina aquí.
```
