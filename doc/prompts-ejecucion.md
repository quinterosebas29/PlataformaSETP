# Prompts de Ejecución — Plan de Implementación Fullstack TypeScript

> **Uso:** Ejecutar cada prompt en orden secuencial.  
> Cada prompt lee el plan y el estado antes de actuar, registra su inicio, ejecuta las tareas, documenta los resultados y al finalizar la fase genera un archivo de resumen independiente.

---

## PROMPT FASE 1 — Inicialización del Repositorio y Scaffolding

```
Actúa como un Ingeniero Fullstack Senior especializado en ecosistemas TypeScript/Next.js.

PASO 1 — LEER CONTEXTO OBLIGATORIO
Antes de hacer cualquier otra cosa, lee completamente estos dos archivos:
1. `plan-implementacion-fases.md` — el plan de implementación completo
2. `estado-ejecucion.md` — el estado actual de ejecución

PASO 2 — REGISTRAR INICIO
En el archivo `estado-ejecucion.md`, dentro del bloque "Historial de Ejecución", agrega la siguiente entrada (respetando el formato definido al pie del archivo):

  - Fase: 1 — Inicialización del Repositorio y Scaffolding
  - Estado: Iniciado
  - Fecha y hora actual
  - Acción: Inicio de ejecución de la Fase 1

También actualiza la tabla de resumen de progreso: cambia el estado de la Fase 1 a 🟡 En progreso y registra la fecha de inicio.

PASO 3 — EJECUTAR LAS TAREAS DE LA FASE 1
Ejecuta todas las tareas definidas en la Fase 1 del plan:
  1.1 — Crear repositorio en GitHub (proporciona los pasos y comandos exactos)
  1.2 — Inicializar proyecto Next.js con el comando especificado
  1.3 — Crear la estructura de carpetas completa con todos los archivos placeholder
  1.4 — Configurar TypeScript estricto en tsconfig.json con las opciones del plan
  1.5 — Configurar next.config.ts según el plan
  1.6 — Configurar los scripts adicionales en package.json
  1.7 — Crear .env.example y .env.local
  1.8 — Instalar dependencias de desarrollo adicionales

Para cada tarea: proporciona el código exacto, comandos de terminal y contenido de archivos listos para copiar y ejecutar.

PASO 4 — VERIFICAR ENTREGABLES
Verifica que se cumplen todos los criterios de aceptación de la Fase 1:
  ✅ npm run type-check — sin errores
  ✅ npm run lint — sin errores
  ✅ npm run dev — levanta en localhost:3000

PASO 5 — REGISTRAR COMPLETION
En `estado-ejecucion.md` agrega una nueva entrada al historial con:
  - Fase: 1 — Completada
  - Fecha y hora
  - Todo lo que se implementó (archivos creados/modificados, comandos ejecutados)
  - Resultados de los criterios de aceptación
  - Cualquier observación, decisión tomada o ajuste aplicado

Actualiza la tabla de resumen: estado de Fase 1 → ✅ Completado, registra fecha de fin.

PASO 6 — CREAR ARCHIVO DE RESUMEN DE FASE
Crea el archivo `resumen-fase-1.md` con la siguiente estructura:

  # Resumen Fase 1 — Inicialización del Repositorio y Scaffolding
  ## Objetivo cumplido
  ## Tareas realizadas (con detalle de cada una)
  ## Archivos creados y modificados
  ## Configuraciones aplicadas (código/contenido relevante)
  ## Criterios de aceptación verificados
  ## Decisiones tomadas y justificaciones
  ## Observaciones y notas para fases siguientes
```

---

## PROMPT FASE 2 — Capa de Datos JSON

```
Actúa como un Ingeniero Fullstack Senior especializado en TypeScript y arquitectura de datos.

PASO 1 — LEER CONTEXTO OBLIGATORIO
Antes de hacer cualquier otra cosa, lee completamente estos dos archivos:
1. `plan-implementacion-fases.md` — el plan de implementación completo
2. `estado-ejecucion.md` — el estado actual de ejecución

Verifica que la Fase 1 esté marcada como ✅ Completado antes de continuar.
Si la Fase 1 no está completada, detente y notifica que debe completarse primero.

PASO 2 — REGISTRAR INICIO
En `estado-ejecucion.md`, dentro del bloque "Historial de Ejecución", agrega:
  - Fase: 2 — Capa de Datos JSON
  - Estado: Iniciado
  - Fecha y hora actual
  - Acción: Inicio de ejecución de la Fase 2

Actualiza la tabla de resumen: Fase 2 → 🟡 En progreso con fecha de inicio.

PASO 3 — EJECUTAR LAS TAREAS DE LA FASE 2
Ejecuta todas las tareas definidas en la Fase 2 del plan:
  2.1 — Crear data/config.json con la estructura exacta del plan
  2.2 — Crear data/README.md documentando el esquema de datos
  2.3 — Implementar lib/db/types.ts con la interface AppConfig
  2.4 — Implementar lib/db/reader.ts con la función genérica readJSON<T>
  2.5 — Configurar lib/db/index.ts con las re-exportaciones centrales

Para cada tarea: proporciona el contenido completo de cada archivo listo para copiar.

PASO 4 — VERIFICAR ENTREGABLES
Verifica el criterio de aceptación de la Fase 2:
  ✅ npm run type-check — tipos de datos compilan sin errores
  ✅ Verificación manual de importación de readJSON<AppConfig>('config')

PASO 5 — REGISTRAR COMPLETION
En `estado-ejecucion.md` agrega al historial:
  - Fase: 2 — Completada
  - Fecha y hora
  - Archivos creados: data/config.json, data/README.md, lib/db/types.ts, lib/db/reader.ts, lib/db/index.ts
  - Resultado de type-check
  - Observaciones sobre la implementación

Actualiza la tabla de resumen: Fase 2 → ✅ Completado con fecha de fin.

PASO 6 — CREAR ARCHIVO DE RESUMEN DE FASE
Crea el archivo `resumen-fase-2.md` con la siguiente estructura:

  # Resumen Fase 2 — Capa de Datos JSON
  ## Objetivo cumplido
  ## Tareas realizadas (con detalle de cada una)
  ## Archivos creados y su contenido final
  ## Tipos TypeScript implementados
  ## Criterios de aceptación verificados
  ## Decisiones tomadas y justificaciones
  ## Observaciones y notas para fases siguientes
```

---

## PROMPT FASE 3 — Componentes UI y Home

```
Actúa como un Diseñador UX/UI y Desarrollador Frontend Senior especializado en interfaces luxury minimalistas con Next.js y TypeScript.

PASO 1 — LEER CONTEXTO OBLIGATORIO
Antes de hacer cualquier otra cosa, lee completamente estos dos archivos:
1. `plan-implementacion-fases.md` — el plan de implementación completo
2. `estado-ejecucion.md` — el estado actual de ejecución

Verifica que las Fases 1 y 2 estén marcadas como ✅ Completado antes de continuar.
Si alguna fase previa no está completada, detente y notifica cuál debe completarse primero.

PASO 2 — REGISTRAR INICIO
En `estado-ejecucion.md`, dentro del bloque "Historial de Ejecución", agrega:
  - Fase: 3 — Componentes UI y Home
  - Estado: Iniciado
  - Fecha y hora actual
  - Acción: Inicio de ejecución de la Fase 3

Actualiza la tabla de resumen: Fase 3 → 🟡 En progreso con fecha de inicio.

PASO 3 — EJECUTAR LAS TAREAS DE LA FASE 3
Ejecuta todas las tareas definidas en la Fase 3 del plan:
  3.1 — Implementar app/globals.css completo:
        - Imports de Google Fonts (Cormorant Garamond y Montserrat)
        - Variables CSS: --color-bg, --color-surface, --color-text, --color-accent, --color-muted, --font-display, --font-body
        - Reset CSS completo
        - Keyframes: fadeSlideUp, shimmer, lineExpand
  3.2 — Implementar components/ui/HolaMundo.tsx:
        - Directiva 'use client'
        - Interface HolaMundoProps con prop greeting opcional
        - Layout flex centrado, full viewport height
        - Animaciones escalonadas con delay progresivo
        - Paleta monocromática con acento dorado
  3.3 — Actualizar app/layout.tsx con metadatos y lang="es"
  3.4 — Actualizar app/page.tsx como Server Component que lee config.json

Proporciona el código completo y listo para copiar de cada archivo.
Cuida el detalle visual: la estética luxury minimalista es el núcleo de esta fase.

PASO 4 — VERIFICAR ENTREGABLES
Verifica los criterios de aceptación de la Fase 3:
  ✅ npm run dev — levanta sin errores
  ✅ npm run type-check — sin errores de tipos
  ✅ Verificación visual en localhost:3000:
     - "Hola Mundo" visible y centrado
     - Animación fadeSlideUp ejecutándose
     - Tipografía Cormorant Garamond en el heading
     - Paleta monocromática con acento dorado
     - Texto del saludo proveniente de data/config.json

PASO 5 — REGISTRAR COMPLETION
En `estado-ejecucion.md` agrega al historial:
  - Fase: 3 — Completada
  - Fecha y hora
  - Archivos creados/modificados: globals.css, HolaMundo.tsx, layout.tsx, page.tsx
  - Decisiones de diseño tomadas (paleta, tipografía, animaciones)
  - Resultado de las verificaciones

Actualiza la tabla de resumen: Fase 3 → ✅ Completado con fecha de fin.

PASO 6 — CREAR ARCHIVO DE RESUMEN DE FASE
Crea el archivo `resumen-fase-3.md` con la siguiente estructura:

  # Resumen Fase 3 — Componentes UI y Home
  ## Objetivo cumplido
  ## Tareas realizadas (con detalle de cada una)
  ## Archivos creados y su contenido final
  ## Decisiones de diseño (paleta, tipografía, animaciones, layout)
  ## Variables CSS implementadas
  ## Criterios de aceptación verificados
  ## Observaciones y notas para fases siguientes
```

---

## PROMPT FASE 4 — API Routes y Validación Local Completa

```
Actúa como un Ingeniero Fullstack Senior especializado en Next.js App Router, API Routes y TypeScript estricto.

PASO 1 — LEER CONTEXTO OBLIGATORIO
Antes de hacer cualquier otra cosa, lee completamente estos dos archivos:
1. `plan-implementacion-fases.md` — el plan de implementación completo
2. `estado-ejecucion.md` — el estado actual de ejecución

Verifica que las Fases 1, 2 y 3 estén marcadas como ✅ Completado antes de continuar.
Si alguna fase previa no está completada, detente y notifica cuál debe completarse primero.

PASO 2 — REGISTRAR INICIO
En `estado-ejecucion.md`, dentro del bloque "Historial de Ejecución", agrega:
  - Fase: 4 — API Routes y Validación Local Completa
  - Estado: Iniciado
  - Fecha y hora actual
  - Acción: Inicio de ejecución de la Fase 4

Actualiza la tabla de resumen: Fase 4 → 🟡 En progreso con fecha de inicio.

PASO 3 — EJECUTAR LAS TAREAS DE LA FASE 4
Ejecuta todas las tareas definidas en la Fase 4 del plan:
  4.1 — Crear app/api/data/route.ts con el GET handler tipado
  4.2 — Verificar la respuesta de la API con curl en localhost:3000/api/data
  4.3 — Ejecutar la validación completa:
        npm run type-check
        npm run lint
        npm run build
  4.4 — Validar la cadena de tipos end-to-end:
        data/config.json → readJSON<AppConfig>() → app/page.tsx → <HolaMundo>
  4.5 — Crear lib/utils/cn.ts con la utilidad de clases CSS condicionales

Para cada tarea: proporciona el código completo listo para copiar.

PASO 4 — VERIFICAR ENTREGABLES
Verifica los criterios de aceptación de la Fase 4:
  ✅ tsc --noEmit — sin errores
  ✅ next build — build exitoso
  ✅ GET /api/data — retorna JSON tipado correctamente
  ✅ Home en localhost:3000 — "Hola Mundo" visible con animación

PASO 5 — REGISTRAR COMPLETION
En `estado-ejecucion.md` agrega al historial:
  - Fase: 4 — Completada
  - Fecha y hora
  - Archivos creados/modificados: app/api/data/route.ts, lib/utils/cn.ts
  - Resultado de type-check, lint y build
  - Resultado de la verificación de la API
  - Observaciones sobre la cadena de tipos

Actualiza la tabla de resumen: Fase 4 → ✅ Completado con fecha de fin.

PASO 6 — CREAR ARCHIVO DE RESUMEN DE FASE
Crea el archivo `resumen-fase-4.md` con la siguiente estructura:

  # Resumen Fase 4 — API Routes y Validación Local Completa
  ## Objetivo cumplido
  ## Tareas realizadas (con detalle de cada una)
  ## Archivos creados y su contenido final
  ## Cadena de tipos end-to-end documentada
  ## Resultados de la validación (type-check, lint, build)
  ## Resultado de la API /api/data
  ## Criterios de aceptación verificados
  ## Observaciones y notas para fases siguientes
```

---

## PROMPT FASE 5 — Pipeline CI/CD (GitHub Actions + Vercel)

```
Actúa como un Ingeniero DevOps y Fullstack Senior especializado en pipelines CI/CD con GitHub Actions y despliegues en Vercel.

PASO 1 — LEER CONTEXTO OBLIGATORIO
Antes de hacer cualquier otra cosa, lee completamente estos dos archivos:
1. `plan-implementacion-fases.md` — el plan de implementación completo
2. `estado-ejecucion.md` — el estado actual de ejecución

Verifica que las Fases 1, 2, 3 y 4 estén marcadas como ✅ Completado antes de continuar.
Si alguna fase previa no está completada, detente y notifica cuál debe completarse primero.

PASO 2 — REGISTRAR INICIO
En `estado-ejecucion.md`, dentro del bloque "Historial de Ejecución", agrega:
  - Fase: 5 — Pipeline CI/CD
  - Estado: Iniciado
  - Fecha y hora actual
  - Acción: Inicio de ejecución de la Fase 5

Actualiza la tabla de resumen: Fase 5 → 🟡 En progreso con fecha de inicio.

PASO 3 — EJECUTAR LAS TAREAS DE LA FASE 5
Ejecuta todas las tareas definidas en la Fase 5 del plan:
  5.1 — Crear .github/workflows/ci.yml con el workflow completo del plan
  5.2 — Guiar el push y verificación de GitHub Actions:
        Comandos exactos de git para hacer el commit y push
        Qué verificar en GitHub → Actions
  5.3 — Guiar la conexión del repositorio a Vercel paso a paso:
        vercel.com/new → Import → configuración del proyecto
  5.4 — Documentar las variables de entorno a configurar en Vercel Dashboard:
        NODE_ENV, NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_APP_VERSION
  5.5 — Configurar Deploy on Push para main y Preview Deployments
  5.6 — Verificar el primer deploy y cómo revisar los logs

Para cada tarea: proporciona instrucciones detalladas, código listo para copiar y capturas de qué verificar.

PASO 4 — VERIFICAR ENTREGABLES
Verifica los criterios de aceptación de la Fase 5:
  ✅ GitHub Actions: All checks passed en cada push
  ✅ Vercel Dashboard: Deployment successful
  ✅ URL de producción carga sin errores

PASO 5 — REGISTRAR COMPLETION
En `estado-ejecucion.md` agrega al historial:
  - Fase: 5 — Completada
  - Fecha y hora
  - Archivos creados: .github/workflows/ci.yml
  - URL de producción generada por Vercel
  - Resultado de GitHub Actions
  - Resultado del primer deploy en Vercel
  - Observaciones del proceso de configuración

Actualiza la tabla de resumen: Fase 5 → ✅ Completado con fecha de fin.

PASO 6 — CREAR ARCHIVO DE RESUMEN DE FASE
Crea el archivo `resumen-fase-5.md` con la siguiente estructura:

  # Resumen Fase 5 — Pipeline CI/CD
  ## Objetivo cumplido
  ## Tareas realizadas (con detalle de cada una)
  ## Workflow de GitHub Actions implementado (contenido del yml)
  ## Configuración de Vercel (pasos y variables configuradas)
  ## URL de producción
  ## Criterios de aceptación verificados
  ## Decisiones de configuración y justificaciones
  ## Observaciones y notas para la fase final
```

---

## PROMPT FASE 6 — Validación en Producción y Cierre

```
Actúa como un Ingeniero Fullstack Senior responsable del cierre y entrega formal de un proyecto.

PASO 1 — LEER CONTEXTO OBLIGATORIO
Antes de hacer cualquier otra cosa, lee completamente estos dos archivos:
1. `plan-implementacion-fases.md` — el plan de implementación completo
2. `estado-ejecucion.md` — el estado actual de ejecución

Verifica que las Fases 1, 2, 3, 4 y 5 estén marcadas como ✅ Completado antes de continuar.
Si alguna fase previa no está completada, detente y notifica cuál debe completarse primero.

PASO 2 — REGISTRAR INICIO
En `estado-ejecucion.md`, dentro del bloque "Historial de Ejecución", agrega:
  - Fase: 6 — Validación en Producción y Cierre
  - Estado: Iniciado
  - Fecha y hora actual
  - Acción: Inicio de la validación final y cierre del proyecto

Actualiza la tabla de resumen: Fase 6 → 🟡 En progreso con fecha de inicio.

PASO 3 — EJECUTAR LAS TAREAS DE LA FASE 6
Ejecuta todas las tareas definidas en la Fase 6 del plan:
  6.1 — Guiar la verificación del Home en producción:
        Qué revisar en la URL de Vercel, cómo probar en móvil
  6.2 — Verificar la API en producción:
        Comando curl exacto con la URL de producción
        Headers y estructura esperada de la respuesta
  6.3 — Revisar logs y métricas en Vercel Dashboard:
        Dónde ver los logs, qué buscar, qué indica éxito
  6.4 — Guiar el flujo completo de preview deployment:
        Comandos git para crear rama, hacer cambio, push
        Cómo verificar el preview en Vercel
        Cómo eliminar la rama de prueba
  6.5 — Crear el contenido completo del README.md final del repositorio:
        Descripción del proyecto
        Instrucciones de instalación y desarrollo local
        Referencia a la URL de producción
        Convenciones de commits y branching
        Comandos disponibles
  6.6 — Guiar la creación del tag v1.0.0:
        git tag v1.0.0 && git push --tags

PASO 4 — VERIFICAR ENTREGABLES FINALES
Verifica todos los criterios de aceptación del plan completo:
  ✅ "Hola Mundo" visible con animación en producción
  ✅ Saludo proveniente del JSON en producción
  ✅ GET /api/data retorna JSON en producción
  ✅ GitHub Actions pasa en push
  ✅ Deploy automático funciona
  ✅ Preview deploy funciona
  ✅ TypeScript strict mode activo
  ✅ Logs de build limpios
  ✅ README.md documentado
  ✅ Tag v1.0.0 creado

PASO 5 — REGISTRAR COMPLETION Y CIERRE GLOBAL
En `estado-ejecucion.md` agrega al historial:
  - Fase: 6 — Completada
  - Estado global del proyecto: ✅ IMPLEMENTACIÓN COMPLETADA
  - Fecha y hora de cierre
  - Tabla completa de criterios de aceptación finales
  - URL de producción final
  - Tag de versión creado
  - Observaciones generales del proyecto

Actualiza la tabla de resumen: Fase 6 → ✅ Completado con fecha de fin.
Actualiza el estado global en el encabezado del archivo: 🟢 Completado.

PASO 6 — CREAR ARCHIVO DE RESUMEN DE FASE Y CIERRE
Crea el archivo `resumen-fase-6.md` con la siguiente estructura:

  # Resumen Fase 6 — Validación en Producción y Cierre
  ## Objetivo cumplido
  ## Tareas realizadas (con detalle de cada una)
  ## Verificaciones en producción (resultados)
  ## README.md final (contenido completo)
  ## Tag de versión
  ## Criterios de aceptación finales verificados
  ## URL de producción
  ## Observaciones del cierre

  ---

  # 🎉 Cierre del Proyecto
  ## Resumen ejecutivo de la implementación completa
  ## Fases completadas y sus logros principales
  ## Stack final implementado
  ## Arquitectura entregada
  ## Próximos pasos recomendados
```

---

## Notas de uso

- **Orden obligatorio:** Los prompts deben ejecutarse en secuencia (1 → 2 → 3 → 4 → 5 → 6). Cada uno verifica que las fases previas estén completadas.
- **Archivos requeridos:** Antes de ejecutar cualquier prompt, asegúrate de tener `plan-implementacion-fases.md` y `estado-ejecucion.md` accesibles.
- **Archivos generados por fase:** Cada fase produce su propio `resumen-fase-N.md` independiente.
- **Estado de ejecución:** Es el registro maestro con el historial completo. No eliminar entradas previas al agregar nuevas.
- **Skill de cada fase:**
  - Fases 1, 2, 4: Ingeniero Fullstack Senior
  - Fase 3: Diseñador UX/UI + Desarrollador Frontend Senior
  - Fase 5: Ingeniero DevOps + Fullstack Senior
  - Fase 6: Ingeniero Fullstack Senior (cierre y entrega)
