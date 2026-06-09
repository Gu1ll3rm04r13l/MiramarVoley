-- ============================================================
-- SCHEMA: Web Miramar Club de Voley (Supabase / Postgres)
-- Correr ESTE archivo primero, luego supabase-seed.sql
-- ============================================================

-- CLUB propio + alias de normalización -----------------------
create table if not exists clubs (
  id                text primary key,
  nombre            text not null,
  nombre_corto      text,
  nombre_en_tablas  text,            -- nombre tal cual aparece en las tablas AMV
  ciudad            text,
  escudo_url        text,
  es_propio         boolean default false,
  aliases           text[] default '{}'
);

create table if not exists club_aliases (
  alias     text primary key,        -- nombre como viene en el sheet AMV
  canonical text not null            -- nombre canónico a mostrar
);

-- CONFIG global (fila única) ---------------------------------
create table if not exists app_config (
  id                int primary key default 1,
  temporada         text,
  objetivo          text,
  usar_numero_nuevo boolean default false,   -- false: muestra numero_actual; true: numero_nuevo
  paleta            jsonb,
  constraint single_row check (id = 1)
);

-- DIVISIONES -------------------------------------------------
create table if not exists divisions (
  id           text primary key,     -- 'ascenso' | 'top8'
  nombre       text not null,
  temporada    text,
  actualizado  date                  -- fecha de actualización de la tabla en AMV
);

-- TABLA DE POSICIONES (importada de AMV, NO se recalcula) -----
create table if not exists standings (
  id           bigint generated always as identity primary key,
  division_id  text references divisions(id) on delete cascade,
  pos          int,
  equipo       text not null,
  pj int, pg int, pp int,
  sf int, sc int, ds int,
  rs numeric,                        -- ratio de sets
  psf int, psc int,
  rp numeric,                        -- ratio de puntos
  pts int
);
create index if not exists idx_standings_division on standings(division_id);

-- PLANTEL ----------------------------------------------------
create table if not exists players (
  id             text primary key,
  club_id        text references clubs(id) on delete set null,
  nombre         text not null,
  posicion       text,
  numero_actual  int,
  numero_nuevo   int,
  estado         text default 'activo',   -- 'activo' | 'buena_fe'
  foto_url       text,
  orden          int
);

-- PARTIDOS ---------------------------------------------------
create table if not exists matches (
  id              text primary key,
  division_id     text references divisions(id) on delete cascade,
  jornada         text,
  fecha           date,
  hora            time,
  local           text not null,
  visitante       text not null,
  sets_local      int,
  sets_visitante  int,
  parciales       text,
  estado          text,    -- 'jugado' | 'pendiente_resultado' | 'proximo'
  nota            text
);
create index if not exists idx_matches_fecha on matches(fecha);

-- REPORTES SETPOINT (Nivel 2) --------------------------------
create table if not exists match_reports (
  id                 text primary key,
  match_id           text references matches(id) on delete cascade,
  torneo             text,
  categoria          text,
  fecha              date,
  duracion_min       int,
  sets_local         int,
  sets_visitante     int,
  equipo_puntos      int,
  equipo_errores     int,
  efectividad        numeric,
  rival_nombre       text,
  rival_puntos       int,
  rival_errores      int,
  resultado_por_set  jsonb,   -- [{set,local,visitante}]
  fundamentos        jsonb,   -- {ataque,recepcion,saque,bloqueo,defensa,contraataque}
  destacados         jsonb    -- {mejorRendimiento, menorRendimiento, mejorSacador}
);

create table if not exists report_players (
  id          bigint generated always as identity primary key,
  report_id   text references match_reports(id) on delete cascade,
  num         int,
  nombre      text,
  saq int, rec int, ata int, bloq int, def int, cata int,
  err int, mas_menos int, rating int
);
create index if not exists idx_report_players_report on report_players(report_id);

-- ============================================================
-- RLS: lectura pública (anon), sin escritura pública.
-- La edición se hace desde el dashboard de Supabase (owner) o
-- con la service_role key. El front usa solo la anon key.
-- ============================================================
alter table clubs           enable row level security;
alter table club_aliases    enable row level security;
alter table app_config      enable row level security;
alter table divisions       enable row level security;
alter table standings       enable row level security;
alter table players         enable row level security;
alter table matches         enable row level security;
alter table match_reports   enable row level security;
alter table report_players  enable row level security;

create policy "public read clubs"          on clubs          for select using (true);
create policy "public read club_aliases"   on club_aliases   for select using (true);
create policy "public read app_config"     on app_config     for select using (true);
create policy "public read divisions"      on divisions      for select using (true);
create policy "public read standings"      on standings      for select using (true);
create policy "public read players"        on players        for select using (true);
create policy "public read matches"        on matches        for select using (true);
create policy "public read match_reports"  on match_reports  for select using (true);
create policy "public read report_players" on report_players for select using (true);

-- ============================================================
-- ESCRITURA: solo usuarios autenticados (vos).
-- Setup en Supabase Auth: deshabilitar sign-ups públicos y
-- crear un único usuario (tu email). El panel /admin usa la
-- sesión autenticada en el browser; el público (anon) solo lee.
-- ============================================================
create policy "auth write clubs"          on clubs          for all to authenticated using (true) with check (true);
create policy "auth write club_aliases"   on club_aliases   for all to authenticated using (true) with check (true);
create policy "auth write app_config"     on app_config     for all to authenticated using (true) with check (true);
create policy "auth write divisions"      on divisions      for all to authenticated using (true) with check (true);
create policy "auth write standings"      on standings      for all to authenticated using (true) with check (true);
create policy "auth write players"        on players        for all to authenticated using (true) with check (true);
create policy "auth write matches"        on matches        for all to authenticated using (true) with check (true);
create policy "auth write match_reports"  on match_reports  for all to authenticated using (true) with check (true);
create policy "auth write report_players" on report_players for all to authenticated using (true) with check (true);

-- ===== Added 2026-06 (post-review) =====
-- One report per match: supports getReportByMatchId via maybeSingle().
alter table match_reports add constraint match_reports_match_id_key unique (match_id);

-- Atomic replace helpers called by the admin Server Actions.
-- SECURITY INVOKER (default) so table RLS still gates writes to authenticated only.
create or replace function replace_report_players(p_report_id text, p_rows jsonb)
returns void language plpgsql as $$
begin
  delete from report_players where report_id = p_report_id;
  if jsonb_array_length(p_rows) > 0 then
    insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating)
    select p_report_id, (r->>'num')::int, r->>'nombre',
           (r->>'saq')::int, (r->>'rec')::int, (r->>'ata')::int,
           (r->>'bloq')::int, (r->>'def')::int, (r->>'cata')::int,
           (r->>'err')::int, (r->>'mas_menos')::int, (r->>'rating')::int
    from jsonb_array_elements(p_rows) as r;
  end if;
end;
$$;

create or replace function replace_division_standings(p_division_id text, p_actualizado date, p_rows jsonb)
returns void language plpgsql as $$
begin
  delete from standings where division_id = p_division_id;
  insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts)
  select p_division_id, (r->>'pos')::int, r->>'equipo',
         (r->>'pj')::int, (r->>'pg')::int, (r->>'pp')::int,
         (r->>'sf')::int, (r->>'sc')::int, (r->>'ds')::int,
         (r->>'rs')::numeric, (r->>'psf')::int, (r->>'psc')::int, (r->>'rp')::numeric, (r->>'pts')::int
  from jsonb_array_elements(p_rows) as r;
  if p_actualizado is not null then
    update divisions set actualizado = p_actualizado where id = p_division_id;
  end if;
end;
$$;
