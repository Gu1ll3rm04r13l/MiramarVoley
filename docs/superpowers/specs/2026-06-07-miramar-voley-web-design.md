# Diseño — Web Miramar Club de Voley (Supabase + Panel admin)

**Fecha:** 2026-06-07
**Estado:** Aprobado para escribir plan de implementación
**Temporada:** 2026 · vóley masculino

## 1. Objetivo

Web institucional para Miramar Club de Voley con un panel `/admin` propio para
autogestionar resultados, reportes de partido y tabla de posiciones (incluido
import desde PDF de SetPoint). Idioma: español rioplatense. Mobile-first,
accesible (AA), deploy en Vercel.

## 2. Stack y decisiones técnicas

- **Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4.**
- **Supabase (Postgres + Auth).** Público lee con anon key (RLS read). Admin
  escribe con sesión autenticada (RLS `authenticated`, ya en el schema).
- **Gestor de paquetes:** npm. **ISR** público con `revalidate = 300`.

Decisiones donde había latitud (elegido → descartado · por qué):

1. **Integración Auth/Supabase → `@supabase/ssr`** (cookies). Un browser client
   (admin), un server client (server actions + middleware) y un cliente anon
   simple para las lecturas públicas ISR. Descarto `auth-helpers-nextjs`
   (deprecado).
2. **Escrituras del admin → Server Actions** con el server client (sesión por
   cookie) + `revalidatePath`. Descarto writes directos desde el browser client
   (exponen flujo en bundle, revalidación manual). RLS `authenticated` cubre
   ambos, pero server actions quedan más limpias y seguras.
3. **Parser PDF → `pdfjs-dist` (legacy build)** importado dinámicamente en un
   componente client-only, con worker local en `/public`. La lógica de parseo
   vive en `setpoint.ts` como función **pura** (`string[]` → `ReportDraft`),
   testeable sin browser. Descarto parsear en server (pdfjs en server/Vercel es
   frágil y suma costo).
4. **Tipos TS → Supabase MCP** `generate_typescript_types` → `database.types.ts`.
5. **Estilos → Tailwind v4** con CSS theme vars derivadas de `app_config.paleta`;
   fuentes con `next/font` (Archivo/Oswald display, Inter body).
6. **Tests → Vitest** solo en libs puras: `setpoint.ts` y `format.ts`. E2E
   (Playwright) queda fuera de alcance de esta tanda.

## 3. Base de datos (ya provista, no se modifica el modelo)

`supabase-schema.sql` (tablas + índices + RLS read pública + write
`authenticated`) y `supabase-seed.sql` (datos reales). Se aplican vía migrations
del MCP de Supabase en F0. Tablas:

`clubs`, `club_aliases`, `app_config` (fila única, id=1), `divisions`,
`standings`, `players`, `matches`, `match_reports`, `report_players`.

Notas del modelo relevantes para el front:

- `app_config.usar_numero_nuevo` (bool) controla qué dorsal se muestra en todo el
  sitio: `false` → `numero_actual`, `true` → `numero_nuevo`.
- `players.estado` ∈ {`activo`, `buena_fe`}. Los `buena_fe` no tienen
  `numero_actual` (mostrar nuevo o "—") y van al final del plantel con badge
  "En lista".
- `matches.estado` ∈ {`jugado`, `pendiente_resultado`, `proximo`}.
- `standings` está **calculada por AMV**: el front NO recalcula, solo presenta y
  muestra `divisions.actualizado`.
- `match_reports` enlaza a `matches.id`; `report_players` enlaza a
  `match_reports.id`. Los `report_players.num` son los números "nuevos".
- El reporte `r01` (Fecha 1) ya está parseado en el seed: es la referencia de la
  forma final del `ReportDraft` que produce el parser de PDF.

### Env vars

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

No se usa la service_role key en el front.

## 4. Arquitectura (capas)

```
Público (anon, RLS read)            Admin (authenticated, RLS write)
─────────────────────────           ────────────────────────────────
Server Components + ISR (300s)      Client components + Server Actions
   ↓ queries.ts (lecturas)             ↓ mutations.ts ('use server')
   supabase.ts (anon)                  supabase-server.ts (cookies)
                                       middleware.ts (guard /admin/*)
                    ↘              ↙
                  Supabase Postgres + RLS
   format.ts  → dorsal según config · highlight "MIRAMAR V" ·
                alias → canonical · NO recalcula tabla
   setpoint.ts → PDF texto → ReportDraft (puro)
                 ← PdfImportButton extrae texto con pdfjs
```

## 5. Estructura de archivos

```
src/
  lib/
    supabase.ts            # cliente anon (lecturas públicas / ISR)
    supabase-browser.ts    # createBrowserClient (@supabase/ssr) — admin
    supabase-server.ts     # createServerClient (@supabase/ssr) — actions/middleware
    queries.ts             # lecturas tipadas (público + admin)
    mutations.ts           # 'use server' — writes del admin + revalidatePath
    setpoint.ts            # parser puro: string[] → ReportDraft
    format.ts              # dorsal/config, highlight Miramar, alias normalize
    database.types.ts      # generado por MCP
  components/
    StandingsTable DivisionToggle MatchCard NextMatchHero
    PlayerCard PlayerModal MatchReport StatBar
  components/admin/
    AdminNav MatchForm ReportForm PlayerStatsGrid PdfImportButton StandingsPasteForm
  app/
    layout.tsx  page.tsx              # Hero + próximo partido + posición
    plantel/  fixture/  tabla/  club/  galeria/
    partido/[id]/
    admin/
      login/  page.tsx               # dashboard admin
      partidos/  reportes/  tabla/
  middleware.ts
tests/
  setpoint.test.ts  format.test.ts
public/
  escudo.png             # lo sube el usuario
  pdf.worker.min.mjs     # worker de pdfjs (copiado del paquete)
```

## 6. Sitio público (Nivel 2 — con stats)

1. **Hero** (`/`): escudo, nombre, objetivo ("Camino al Top 8"), card del próximo
   partido y posición actual (4° Ascenso). "Próximo partido" = entre
   {`proximo`, `pendiente_resultado`}, el de menor `fecha >= hoy`; si no hay
   futuros, el `pendiente_resultado` más reciente; si tampoco, el `proximo` más
   próximo.
2. **Tabla** (`/tabla`): completa, toggle Ascenso ⇄ Top 8. En mobile colapsa a
   PJ / PG-PP / sets / PTS. Muestra "actualizado". Resalta fila MIRAMAR V.
3. **Fixture** (`/fixture`): partidos de Miramar. Jugados con marcador + link a
   reporte (si existe); pendientes; próximos. Filtro por estado.
4. **Detalle de partido** (`/partido/[id]`): reporte SetPoint — resultado por set,
   MVP/destacados, barras por fundamento (StatBar), tabla de rendimiento por
   jugador (rating, +/-).
5. **Plantel** (`/plantel`): grid (dorsal según config, nombre, posición,
   foto/placeholder, badge `buena_fe`). Modal con stats acumuladas (promedio de
   `report_players`). **Join primario por `report_players.num =
   players.numero_nuevo`**, fallback por nombre normalizado (sin acentos,
   case-insensitive). El join solo-por-nombre falla: el seed tiene `"Ariel Del
   Fresno"` vs `"Guillermo Ariel del Fresno"` y `"Nicolas"` vs `"Nicolás"`, pero
   el `num` siempre matchea.
6. **El club** (`/club`): institucional breve + objetivo.
7. **Galería** (`/galeria`): grilla simple (placeholders).

Header sticky + footer con Instagram `@voleyclubmiramar`.

## 7. Panel `/admin`

Layout con nav lateral (`AdminNav`). Protegido por `middleware.ts`: sin sesión →
redirige a `/admin/login`. Tres módulos:

1. **Resultado de partido** (`/admin/partidos`): listado de `matches` + form para
   cargar/editar (sets local/visitante, parciales, `estado`, hora, nota). Botón
   "nuevo partido".
2. **Reporte SetPoint** (`/admin/reportes`): form de cabecera (torneo, categoría,
   fecha, duración, sets, puntos/errores propios y rival, efectividad) + grilla
   editable de jugadores (num, nombre, saq, rec, ata, bloq, def, cata, err, +/-,
   rating) + 6 fundamentos del equipo + destacados (MVP, menor, mejor sacador).
   Guarda en `match_reports` + `report_players` enlazando a `matches.id`. Incluye
   **PdfImportButton**: file-picker → parsea client-side → **precarga el form**
   (nunca guarda directo; el usuario revisa y confirma).
3. **Tabla de posiciones** (`/admin/tabla`): selector de división + fecha de
   actualización + textarea "pegar desde AMV" (filas tab-separadas → grilla →
   revisar → guardar; reemplaza la tabla de esa división). Columnas: POS, EQUIPO,
   PJ, PG, PP, SF, SC, DS, RS, PSF, PSC, RP, PTS (RS/RP con coma decimal →
   convertir a punto).

Plantel, textos institucionales, flag de dorsales y galería se gestionan desde el
Table Editor de Supabase (sin UI propia).

## 8. Parser PDF SetPoint (`setpoint.ts`)

Función pura `parseSetpoint(lines: string[]): ReportDraft`. Extracción de texto
con `pdfjs-dist` ocurre en `PdfImportButton` (client). Tratar `-` como `null`.
**Siempre precarga el form; nunca guarda directo.**

Anclas de cabecera:

- `Resultado (Sets)` → `"X - Y"` (sets local/visitante).
- `Total Puntos` → número · `Duración` → `"75 min"`.
- `Equipo Local` / `Equipo Visitante` → nombres.
- `Fecha` → texto (ej. "domingo, 29 de marzo de 2026") → ISO.
- `Categoría` → texto.
- Por equipo: `Puntos totales:` y `Errores:`.
- `Rendimiento del Equipo por Fundamento`: `Ataque`, `Recepción`, `Saque`,
  `Bloqueo`, `Defensa`, `Contraataque` → 0-100.
- `Jugadores Destacados`: `MEJOR RENDIMIENTO` / `MENOR RENDIMIENTO` (#num, nombre,
  `Rating:`), `MEJOR SACADOR` (#num, nombre, `Saque:`).

Fuente principal de jugadores → tabla "Rendimiento por Jugador":
`#  Jugador  Saq  Rec  Ata  Bloq  Def  C.Ata  Err  +/-  Rating`
ej.: `8  Francisco Pomares  42  -  88  50  -  84  2  +10  66`. Cada fila →
`report_players`. Reconciliar con `players` por **`num = numero_nuevo`** (los
números del PDF son los "nuevos"), fallback por nombre normalizado. No reconciliar
solo por nombre: difiere por acentos/casing/forma (ver §5).

Validación: la salida del parser debe coincidir en forma con el reporte `r01` del
seed (test de Vitest sobre un fixture de líneas representativo).

## 9. Identidad visual

Dark deportivo, azul + acero/plateado, sobrio. Paleta (de `app_config.paleta`):
Azul primario `#065FA7`, Azul brillante `#0686CD`, Navy `#0C2A4A`, Acero
`#A0A09C`, Blanco hueso `#F2F3EF`, Casi negro `#1A1C20`. Como CSS vars + theme
Tailwind. Títulos en sans condensada (Archivo/Oswald), texto Inter. Dorsales
grandes. Detalles en acero. Microinteracciones sutiles. `next/image`.

## 10. Reglas de datos clave (acceptance-bound)

1. Doble numeración por `usar_numero_nuevo` cambia todos los dorsales del sitio.
   `buena_fe` sin `numero_actual` → muestra nuevo o "—".
2. `buena_fe` con badge "En lista", al final del plantel.
3. Próximos: `estado` ∈ {`proximo`, `pendiente_resultado`}, orden por `fecha` asc;
   el destacado del Hero se elige según la regla de §6.1.
4. Resaltar Miramar en ambas tablas: `standings.equipo == clubs.nombre_en_tablas`
   ("MIRAMAR V").
5. Normalizar rivales con `club_aliases` (alias → canonical).
6. Tabla de posiciones NO se recalcula: solo presentar + `divisions.actualizado`.

## 11. Plan por fases (checkpoint en cada una)

- **F0 — Infra:** crear proyecto Supabase ("Miramar Voley") en la org, aplicar
  `schema` + `seed` (migrations MCP), generar `database.types.ts`, scaffold Next +
  Tailwind + env. **Paso manual del usuario:** crear el usuario admin (su email +
  password) en Supabase Auth y deshabilitar sign-ups públicos.
  *Check:* seed visible vía query tipada.
- **F1 — Libs core (TDD):** `format.ts` (dorsal/config, highlight, alias) +
  `queries.ts`. Tests de `format`. *Check:* tests verde.
- **F2 — Sitio público:** theme/header/footer, Hero, `/tabla`, `/fixture`,
  `/partido/[id]`, `/plantel`, `/club`, `/galeria`. ISR. *Check:* responsive a
  360px sin scroll horizontal.
- **F3 — Auth/admin shell:** `middleware.ts` guard, `/admin/login`, `AdminNav`,
  scaffold de `mutations.ts`. *Check:* login ok, guard redirige.
- **F4 — Módulos admin:** `MatchForm`, `ReportForm` + `PlayerStatsGrid`,
  `StandingsPasteForm` (server actions + revalidatePath). *Check:* cargar un
  reporte por form → visible en detalle público + stats del jugador.
- **F5 — Parser PDF (TDD):** `setpoint.ts` (test vs forma de `r01`),
  `PdfImportButton` precarga `ReportForm`. *Check:* import precarga el form.
- **F6 — Pulido + deploy:** a11y AA + teclado, microinteracciones, Lighthouse
  mobile ≥ 90 (Performance + Accesibilidad), deploy Vercel + env vars.

## 12. Criterios de aceptación

- Build Vercel OK; Lighthouse mobile ≥ 90 (Performance y Accesibilidad) en
  público.
- Anon solo lee; `/admin` exige sesión; escrituras funcionan logueado.
- Cambiar `usar_numero_nuevo` actualiza todos los dorsales.
- Cargar un reporte (form o import PDF) lo deja visible en el detalle de partido y
  en las stats del jugador.
- El import de PDF de la Fecha 1 precarga el form para revisión.
- Sin scroll horizontal en 360px; tablas usables en mobile.

## 13. Pendiente (lo carga el usuario)

Fotos de jugadores y galería · textos institucionales · más reportes (form o PDF)
· escudo en alta · password del usuario admin.

## 14. Fuera de alcance (esta tanda)

E2E/Playwright · UI propia para plantel/textos/galería (se usa Table Editor) ·
recálculo de tabla · multiusuario/roles.
