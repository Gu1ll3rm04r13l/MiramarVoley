# Mega-prompt — Web Miramar Club de Voley (Supabase + Panel admin)

Construí una web institucional para **Miramar Club de Voley** (vóley masculino, temporada 2026), con **Supabase (Postgres)** como base de datos y un **panel `/admin` propio** para autogestionar resultados, reportes y tabla (incluido **import desde PDF de SetPoint**). En español rioplatense.

## Stack
- **Next.js 15 (App Router) + TypeScript + Tailwind CSS**. Deploy en **Vercel**.
- **Supabase**: DB + Auth. El sitio público lee con la **anon key** (RLS de solo lectura). El panel `/admin` escribe con la **sesión autenticada** del usuario (RLS de escritura para `authenticated`).
- **Parsing de PDF client-side** con `pdfjs-dist` (sin servidor/costo extra).
- Mobile-first, 100% responsive, accesible (AA, teclado). `next/image`. Escudo en `/public/escudo.png` (lo agrego yo).

## Base de datos (ya provista)
- `supabase-schema.sql` → tablas + índices + RLS (lectura pública + escritura solo `authenticated`). **Correr primero.**
- `supabase-seed.sql` → datos reales (club, config, divisiones, tabla Ascenso+Top 8, 17 jugadores, 12 partidos, reporte Fecha 1). **Correr después.**

Tablas: `clubs`, `club_aliases`, `app_config`, `divisions`, `standings`, `players`, `matches`, `match_reports`, `report_players`. (Detalle de columnas en el .sql.)

### Env vars
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
Cliente en `src/lib/supabase.ts`. Tipos TS generados desde la DB (`supabase gen types typescript` → `src/lib/database.types.ts`). Páginas públicas con **Server Components + ISR** (`revalidate = 300`). El panel revalida (revalidatePath) tras cada guardado.

## Auth (un solo usuario: vos)
- Supabase Auth con email/password. **Deshabilitar sign-ups públicos**; crear un único usuario (mi email).
- `/admin/*` protegido por middleware: sin sesión → redirige a `/admin/login`.
- Escrituras desde el browser autenticado (las políticas RLS `authenticated` ya están en el schema). No usar la service_role key en el front.

## Reglas de datos clave
1. **Doble numeración:** `app_config.usar_numero_nuevo` (false → `numero_actual`, true → `numero_nuevo`). Cambia todos los dorsales del sitio. `buena_fe` sin `numero_actual` → mostrar nuevo o "—".
2. **Estado de jugador:** `activo` normal; `buena_fe` con badge "En lista", al final del plantel.
3. **Próximos partidos:** `estado` en (`proximo`, `pendiente_resultado`), orden por `fecha` asc; el más cercano va al Hero.
4. **Resaltar Miramar** en ambas tablas: `standings.equipo` == `clubs.nombre_en_tablas` ("MIRAMAR V").
5. **Normalizar rivales** con `club_aliases` (alias → canonical).
6. Tabla de posiciones **calculada por AMV**: NO recalcular, solo presentar + fecha `divisions.actualizado`.

## Identidad visual
**Dark deportivo, azul + acero/plateado**, sobrio y prolijo. Paleta (en `app_config.paleta`): Azul primario `#065FA7`, Azul brillante `#0686CD`, Navy `#0C2A4A`, Acero `#A0A09C`, Blanco hueso `#F2F3EF`, Casi negro `#1A1C20`. CSS vars / theme Tailwind. Títulos en sans deportiva condensada (*Archivo*/*Oswald*), texto *Inter*. Dorsales grandes. Detalles en acero (aro del escudo). Microinteracciones sutiles.

## Sitio público (Nivel 2 — con stats)
1. **Hero** — escudo, nombre, objetivo ("Camino al Top 8"), card del próximo partido + posición (4° Ascenso).
2. **Tabla de posiciones** — completa, toggle **Ascenso ⇄ Top 8**; en mobile colapsa a PJ/PG-PP/sets/PTS. Muestra "actualizado".
3. **Fixture y resultados** — partidos de Miramar (jugados con marcador y link a reporte; pendientes; próximos). Filtro por estado.
4. **Detalle de partido** — reporte: resultado por set, MVP/destacados, barras por fundamento, tabla de rendimiento por jugador (rating, +/-).
5. **Plantel** — grid (dorsal, nombre, posición, foto/placeholder; badge `buena_fe`). Modal con stats acumuladas (promedio de `report_players`, join por nombre).
6. **El club** — institucional breve + objetivo.
7. **Galería** — grilla simple (placeholders).

Header sticky + footer con Instagram `@voleyclubmiramar`.

## Panel `/admin` (mínimo, enfocado en lo que se repite)
Layout con nav lateral. Tres módulos:

### 1. Resultado de partido
- Listado de `matches`. Form para cargar/editar: sets local/visitante, parciales, `estado`, hora, nota.
- Botón "nuevo partido" para fechas que falten.

### 2. Reporte SetPoint  ← el que más ahorra
- Form de cabecera (torneo, categoría, fecha, duración, sets, puntos/errores propios y del rival, efectividad) + **grilla editable de jugadores** (num, nombre, saq, rec, ata, bloq, def, cata, err, +/-, rating) + fundamentos del equipo (6 valores) + destacados (MVP, menor, mejor sacador).
- Guarda en `match_reports` + `report_players` y enlaza al `matches.id`.
- **Importar desde PDF (SetPoint):** botón que abre file-picker, parsea el PDF client-side y **precarga todo el form** para que yo revise y confirme antes de guardar. (Spec de parsing abajo.)

### 3. Tabla de posiciones
- Selector de división (Ascenso/Top 8) + fecha de actualización.
- **Textarea "pegar desde AMV":** pego las filas del sheet (tab-separadas), se parsean a la grilla, reviso y guardo (reemplaza la tabla de esa división). Columnas esperadas: POS, EQUIPO, PJ, PG, PP, SF, SC, DS, RS, PSF, PSC, RP, PTS (RS/RP pueden venir con coma decimal → convertir a punto).

> Plantel, textos institucionales, flag de dorsales y galería se gestionan desde el **Table Editor de Supabase** (no hace falta UI propia).

## Spec de parsing — PDF SetPoint
Formato consistente generado por SetPoint. Extraer texto con `pdfjs-dist` y parsear por anclas. **Siempre precargar el form para revisión manual; nunca guardar directo.** Tratar `-` como `null`.

Anclas de cabecera:
- `Resultado (Sets)` → `"X - Y"` (sets local/visitante).
- `Total Puntos` → número · `Duración` → `"75 min"`.
- `Equipo Local` → nombre local · `Equipo Visitante` → nombre visitante.
- `Fecha` → fecha en texto (ej. "domingo, 29 de marzo de 2026") → ISO.
- `Categoría` → texto.
- Por equipo: `Puntos totales:` y `Errores:`.
- Bloque `Rendimiento del Equipo por Fundamento`: `Ataque`, `Recepción`, `Saque`, `Bloqueo`, `Defensa`, `Contraataque` → valor 0-100.
- `Jugadores Destacados`: `MEJOR RENDIMIENTO` / `MENOR RENDIMIENTO` (#num, nombre, `Rating:`), `MEJOR SACADOR` (#num, nombre, `Saque:`).

Fuente principal de jugadores → la **tabla "Rendimiento por Jugador"** (la grilla numérica), filas con formato:
`#  Jugador  Saq  Rec  Ata  Bloq  Def  C.Ata  Err  +/-  Rating`
ej.: `8  Francisco Pomares  42  -  88  50  -  84  2  +10  66`
Mapear cada fila a `report_players`. Reconciliar con `players` por **nombre** (los números del PDF son los "nuevos").

(En `supabase-seed.sql` está el reporte de la Fecha 1 ya parseado: úsalo como referencia de la forma final de los datos.)

## Arquitectura técnica
- `src/lib/supabase.ts` (cliente público) · `src/lib/supabase-browser.ts` (cliente con sesión para admin).
- `src/lib/queries.ts`: lecturas tipadas. `src/lib/mutations.ts`: writes del admin.
- `src/lib/setpoint.ts`: parser del PDF (texto → objeto reporte).
- `src/lib/format.ts`: dorsal según config, resaltar Miramar, normalizar con aliases. NO recalcular tabla.
- Componentes públicos: `StandingsTable`, `DivisionToggle`, `MatchCard`, `NextMatchHero`, `PlayerCard`, `PlayerModal`, `MatchReport`, `StatBar`.
- Admin: `AdminNav`, `MatchForm`, `ReportForm` (con `PlayerStatsGrid` + `PdfImportButton`), `StandingsPasteForm`.
- Rutas: público `/`, `/plantel`, `/fixture`, `/partido/[id]`, `/tabla`. Admin `/admin/login`, `/admin`, `/admin/partidos`, `/admin/reportes`, `/admin/tabla`.

## Criterios de aceptación
- Build Vercel OK; Lighthouse mobile ≥ 90 (Performance y Accesibilidad) en el sitio público.
- Anon solo lee; `/admin` exige sesión; escrituras funcionan logueado.
- Cambiar `usar_numero_nuevo` actualiza todos los dorsales.
- Cargar un reporte por el form (o por import de PDF) lo deja visible en el detalle de partido y en las stats del jugador.
- El import de PDF de la Fecha 1 (el de ejemplo) precarga el form correctamente para revisión.
- Sin scroll horizontal en 360px; tablas usables en mobile.

## Pendiente (lo cargo yo)
- Fotos de jugadores y galería · textos institucionales · más reportes (por form o PDF) · escudo en alta.

Orden sugerido: Supabase + tipos + auth/middleware → sitio público (tabla, fixture, plantel, reporte) → panel admin (resultado, reporte manual, tabla paste) → parser de PDF → pulido visual y responsive.
