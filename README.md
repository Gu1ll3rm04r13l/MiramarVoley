# Miramar Club de Vóley

Sitio institucional y panel de autogestión para **Miramar Club de Vóley** (vóley masculino, temporada 2026). Muestra tabla de posiciones, fixture, plantel y reportes de partido, con un panel `/admin` para cargar resultados, reportes (incluido import desde PDF de SetPoint) y la tabla.

## Características

### Sitio público
- **Inicio:** próximo partido y posición actual en la tabla.
- **Tabla de posiciones:** Ascenso ⇄ Top 8, fila de Miramar resaltada, responsive (colapsa columnas en mobile).
- **Fixture y resultados:** partidos de Miramar con filtros por estado; los jugados enlazan a su reporte.
- **Detalle de partido:** resultado por set, jugadores destacados, rendimiento por fundamento y tabla de rendimiento por jugador.
- **Plantel:** grilla con dorsal, posición y badge para jugadores en lista de buena fe; modal con estadísticas acumuladas por jugador.

### Panel `/admin` (requiere sesión)
- **Resultados:** carga y edición de partidos (sets, parciales, estado, etc.).
- **Reporte SetPoint:** formulario con grilla de jugadores e **importación desde PDF**, que precarga el formulario para revisar antes de guardar.
- **Tabla de posiciones:** se pega la tabla desde la planilla de la liga; los nombres de equipo se normalizan con alias y se reemplaza la división de forma atómica.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Auth con RLS) · Vitest. Deploy en Vercel.

## Arquitectura

- **Páginas públicas:** Server Components con ISR (`revalidate = 300`), lectura con la *anon key* (RLS de solo lectura).
- **Panel admin:** Client Components + Server Actions que escriben con la sesión autenticada (RLS para `authenticated`). Un middleware protege `/admin/*`.
- **Lógica pura testeada (Vitest):** `src/lib/format.ts` (dorsales según configuración, normalización de clubes/nombres, selección del próximo partido), `src/lib/setpoint.ts` (parser de PDF de SetPoint) y `src/lib/standings-paste.ts` (parseo de la tabla pegada).

```
src/
  app/         Rutas públicas (/, /tabla, /fixture, /partido/[id], /plantel, /club, /galeria) y /admin/*
  components/  UI pública + components/admin
  lib/         Clientes Supabase, queries, mutations, format, setpoint, types
  middleware.ts
supabase/      supabase-schema.sql + supabase-seed.sql
tests/         Pruebas de la lógica pura
```

## Puesta en marcha

Requisitos: Node 20+, npm y un proyecto de Supabase.

1. **Variables de entorno** — crear `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```

2. **Base de datos** — en el SQL Editor de Supabase, ejecutar en orden:
   - `supabase/supabase-schema.sql` (tablas, índices, RLS y funciones)
   - `supabase/supabase-seed.sql` (datos iniciales)

3. **Autenticación** — crear un único usuario (email/contraseña) en Supabase Auth y **deshabilitar el registro público**. Ese usuario es el login del panel `/admin`.

## Scripts

```bash
npm install
npm run dev      # entorno de desarrollo en http://localhost:3000
npm test         # pruebas con Vitest
npm run build    # build de producción
npm run start    # servir el build de producción
```

## Despliegue (Vercel)

Importar el repositorio en Vercel, definir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, y desplegar. Las páginas públicas se sirven con ISR; el panel revalida las rutas afectadas tras cada guardado.

## Instagram

[@voleyclubmiramar](https://instagram.com/voleyclubmiramar)
