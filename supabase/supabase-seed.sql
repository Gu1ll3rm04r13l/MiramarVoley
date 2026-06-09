-- SEED: Miramar Club de Voley (temporada 2026)
-- Correr DESPUES de supabase-schema.sql

-- Club propio + config
insert into clubs (id, nombre, nombre_corto, nombre_en_tablas, ciudad, escudo_url, es_propio, aliases) values ('miramar', 'Miramar Club de Voley', 'Miramar Voley', 'MIRAMAR V', 'Miramar, Buenos Aires', '/escudo.png', true, ARRAY['MIRAMAR','MIRAMAR V.','MIRAMAR V']) on conflict (id) do nothing;
insert into app_config (id, temporada, objetivo, usar_numero_nuevo, paleta) values (1, '2026', 'Ascender al Top 8', false, '{"azulPrimario": "#065FA7", "azulBrillante": "#0686CD", "navy": "#0C2A4A", "acero": "#A0A09C", "blancoHueso": "#F2F3EF", "casiNegro": "#1A1C20"}'::jsonb) on conflict (id) do nothing;

-- Alias de clubes para normalizar nombres del sheet AMV
insert into club_aliases (alias, canonical) values ('MIRAMAR', 'MIRAMAR V') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('MIRAMAR V.', 'MIRAMAR V') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('MIRAMAR V', 'MIRAMAR V') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('ATLE', 'ATLE GESELL') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('ATLE GESELL', 'ATLE GESELL') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('GESELL', 'ATLE GESELL') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('ONCE U', 'ONCE U') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('ONCE UNIDOS', 'ONCE U') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('DALELAPALA', 'DALELAPALA') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('DALE LA PALA', 'DALELAPALA') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('CAI DOLORES', 'CAI DOLORES') on conflict (alias) do nothing;
insert into club_aliases (alias, canonical) values ('CAI', 'CAI DOLORES') on conflict (alias) do nothing;

-- Divisiones
insert into divisions (id, nombre, temporada, actualizado) values ('ascenso', '1ª Ascenso Masculino', '2026', '2026-05-31') on conflict (id) do nothing;
insert into divisions (id, nombre, temporada, actualizado) values ('top8', '1ª Top 8 Masculino', '2026', '2026-05-31') on conflict (id) do nothing;

-- Tabla de posiciones (calculada por AMV - NO recalcular)
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 1, 'PEÑAROL', 8, 7, 1, 23, 6, 17, 3.83, 678, 491, 1.38, 21);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 2, 'AGP', 8, 6, 2, 20, 10, 10, 2, 690, 623, 1.11, 18);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 3, 'TALLERES', 7, 6, 1, 18, 7, 11, 2.57, 575, 474, 1.21, 17);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 4, 'MIRAMAR V', 7, 5, 2, 18, 7, 11, 2.57, 567, 440, 1.29, 16);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 5, 'EDAL', 7, 5, 2, 15, 9, 6, 1.67, 439, 501, 0.88, 14);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 6, 'QUILMES A', 7, 4, 3, 17, 11, 6, 1.55, 611, 550, 1.11, 13);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 7, 'ATLE GESELL', 9, 4, 5, 18, 19, -1, 0.95, 798, 759, 1.05, 13);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 8, 'SUDAMERICA', 8, 4, 4, 16, 15, 1, 1.07, 679, 660, 1.03, 12);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 9, 'CDT B', 8, 3, 5, 11, 18, -7, 0.61, 619, 680, 0.91, 8);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 10, 'CAI DOLORES', 8, 2, 6, 7, 20, -13, 0.35, 529, 635, 0.83, 5);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 11, 'CDT C', 9, 1, 8, 7, 25, -18, 0.28, 603, 750, 0.8, 4);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('ascenso', 12, 'QUILMES B', 8, 0, 8, 1, 24, -23, 0.04, 397, 622, 0.64, 0);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('top8', 1, 'ONCE A', 5, 5, 0, 15, 0, 15, 15, 379, 280, 1.35, 15);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('top8', 2, 'BANCO A', 5, 5, 0, 15, 2, 13, 7.5, 406, 324, 1.25, 14);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('top8', 3, 'CDT', 6, 3, 3, 13, 11, 2, 1.18, 530, 505, 1.05, 11);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('top8', 4, 'BANCO B', 6, 4, 2, 12, 10, 2, 1.2, 448, 460, 0.97, 10);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('top8', 5, 'MCH', 5, 3, 2, 9, 8, 1, 1.12, 367, 340, 1.08, 8);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('top8', 6, 'PEÑAROL', 6, 1, 5, 8, 16, -8, 0.5, 497, 550, 0.9, 5);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('top8', 7, 'ONCE B', 5, 1, 4, 5, 12, -7, 0.42, 374, 396, 0.94, 3);
insert into standings (division_id, pos, equipo, pj, pg, pp, sf, sc, ds, rs, psf, psc, rp, pts) values ('top8', 8, 'DALELAPALA', 6, 0, 6, 0, 18, -18, 0, 304, 450, 0.68, 0);

-- Plantel
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p01', 'miramar', 'Esteban Blasco', 'Central', 1, 1, 'activo', NULL, 1) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p02', 'miramar', 'Rodrigo Perez', 'Punta', 2, 2, 'activo', NULL, 2) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p03', 'miramar', 'Nicolás Krasnopolski', 'Central', 5, 5, 'activo', NULL, 3) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p04', 'miramar', 'Braian Aramayo', 'Armador', 7, 7, 'activo', NULL, 4) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p05', 'miramar', 'Francisco Pomares', 'Central', 8, 8, 'activo', NULL, 5) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p06', 'miramar', 'Matias Gerber', 'Punta', 9, 17, 'activo', NULL, 6) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p07', 'miramar', 'Enzo Grimaldi', 'Opuesto', 11, 11, 'activo', NULL, 7) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p08', 'miramar', 'Guillermo Ariel del Fresno', 'Punta / Central', 12, 20, 'activo', NULL, 8) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p09', 'miramar', 'Alex Angel', 'Líbero / Armador', 13, 18, 'activo', NULL, 9) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p10', 'miramar', 'Fausto Caielli', 'Central / Opuesto', 15, 3, 'activo', NULL, 10) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p11', 'miramar', 'Elias Gonzalez', 'Opuesto', 17, 10, 'activo', NULL, 11) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p12', 'miramar', 'Carlos Ledesma', 'Líbero', 24, 4, 'activo', NULL, 12) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p13', 'miramar', 'Gastón Espindola', 'Punta', 50, 15, 'activo', NULL, 13) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p14', 'miramar', 'Elio Contreras', 'Opuesto', NULL, 9, 'buena_fe', NULL, 14) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p15', 'miramar', 'Guido Grimaldi', 'Armador', NULL, 14, 'buena_fe', NULL, 15) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p16', 'miramar', 'Isaac Ceballos', 'Punta', NULL, 19, 'buena_fe', NULL, 16) on conflict (id) do nothing;
insert into players (id, club_id, nombre, posicion, numero_actual, numero_nuevo, estado, foto_url, orden) values ('p17', 'miramar', 'Pablo Medina', 'Sin posición', NULL, 13, 'buena_fe', NULL, 17) on conflict (id) do nothing;

-- Partidos (Ascenso) - resultados reconstruidos desde parciales
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m01', 'ascenso', 'Fecha 1', '2026-03-29', NULL, 'MIRAMAR V', 'CAI DOLORES', 3, 0, '25-8/25-19/25-21', 'jugado', NULL) on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m02', 'ascenso', 'Fecha 4', '2026-04-24', NULL, 'MIRAMAR V', 'EDAL', 3, 0, '25-0/25-0/25-0', 'jugado', 'WO') on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m03', 'ascenso', 'Fecha 5', '2026-04-30', NULL, 'AGP', 'MIRAMAR V', 3, 1, '25-19/25-9/24-26/26-24', 'jugado', NULL) on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m04', 'ascenso', 'Fecha 2 (repro.)', '2026-05-10', NULL, 'MIRAMAR V', 'PEÑAROL', 2, 3, '22-25/25-16/25-15/11-25/11-15', 'jugado', NULL) on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m05', 'ascenso', 'Fecha 7', '2026-05-17', NULL, 'MIRAMAR V', 'CDT C', 3, 0, '25-18/25-21/25-19', 'jugado', NULL) on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m06', 'ascenso', 'Fecha 8', '2026-05-21', NULL, 'CDT B', 'MIRAMAR V', 1, 3, '20-25/11-25/25-20/23-25', 'jugado', NULL) on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m07', 'ascenso', 'Fecha 9', '2026-05-31', NULL, 'SUDAMERICA', 'MIRAMAR V', 0, 3, '21-25/19-25/19-25', 'jugado', NULL) on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m08', 'ascenso', 'Fecha 10', '2026-06-06', NULL, 'QUILMES A', 'MIRAMAR V', NULL, NULL, NULL, 'pendiente_resultado', NULL) on conflict (id) do nothing;
-- m09 (ATLE GESELL · Fecha 11 · 13/6) eliminado: el partido vs Gesell se reprogramó a la Fecha 12 (20/6 = m11). Fecha 11 real = TALLERES (m10).
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m10', 'ascenso', 'Fecha 11', '2026-06-13', '20:00', 'TALLERES', 'MIRAMAR V', NULL, NULL, NULL, 'proximo', NULL) on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m11', 'ascenso', 'Fecha 12', '2026-06-20', '18:00', 'ATLE GESELL', 'MIRAMAR V', NULL, NULL, NULL, 'proximo', NULL) on conflict (id) do nothing;
insert into matches (id, division_id, jornada, fecha, hora, local, visitante, sets_local, sets_visitante, parciales, estado, nota) values ('m12', 'ascenso', 'Fecha 12', '2026-06-21', '18:00', 'QUILMES B', 'MIRAMAR V', NULL, NULL, NULL, 'proximo', NULL) on conflict (id) do nothing;

-- Reportes SetPoint (Nivel 2)
insert into match_reports (id, match_id, torneo, categoria, fecha, duracion_min, sets_local, sets_visitante, equipo_puntos, equipo_errores, efectividad, rival_nombre, rival_puntos, rival_errores, resultado_por_set, fundamentos, destacados) values ('rep_m01', 'm01', 'Fecha 1 Apertura', 'Primera Masculina', '2026-03-29', 75, 3, 0, 75, 24, 70.0, 'CAI DOLORES', 48, 36, '[{"set": 1, "local": 25, "visitante": 8}, {"set": 2, "local": 25, "visitante": 19}, {"set": 3, "local": 25, "visitante": 21}]'::jsonb, '{"ataque": 60, "recepcion": 38, "saque": 45, "bloqueo": 58, "defensa": 63, "contraataque": 68}'::jsonb, '{"mejorRendimiento": {"jugador": "Alex Angel", "num": 18, "rating": 75}, "menorRendimiento": {"jugador": "Gastón Espindola", "num": 15, "rating": 35}, "mejorSacador": {"jugador": "Matias Gerber", "num": 17, "saque": 56}}'::jsonb) on conflict (id) do nothing;
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 8, 'Francisco Pomares', 42, NULL, 88, 50, NULL, 84, 2, 10, 66);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 2, 'Rodrigo Perez', 50, NULL, 50, NULL, NULL, NULL, 1, 1, 50);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 7, 'Braian Aramayo', 52, NULL, NULL, NULL, NULL, NULL, 0, 1, 52);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 10, 'Elias Gonzalez', 50, NULL, NULL, 100, NULL, 58, 1, 2, 69);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 17, 'Matias Gerber', 56, 75, 46, 50, NULL, 72, 3, 7, 60);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 5, 'Nicolas Krasnopolski', 50, NULL, 63, 50, NULL, NULL, 0, 2, 54);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 4, 'Carlos Ledesma', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 18, 'Alex Angel', NULL, NULL, NULL, NULL, 75, NULL, 0, 2, 75);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 9, 'Elio Contreras', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 1, 'Esteban Blasco', 25, NULL, NULL, 83, NULL, NULL, 1, 1, 54);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 3, 'Fausto Caielli', 25, NULL, 50, 50, 25, 46, 3, -2, 39);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 15, 'Gastón Espindola', 13, 0, 58, 0, 75, 65, 5, -1, 35);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 14, 'Guido Grimaldi', 50, NULL, NULL, NULL, NULL, NULL, 0, 0, 50);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 19, 'Isaac Ceballos', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 13, 'Pablo Medina', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 11, 'Enzo Grimaldi', 50, NULL, 75, NULL, NULL, 75, 0, 2, 67);
insert into report_players (report_id, num, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos, rating) values ('rep_m01', 20, 'Ariel Del Fresno', 50, NULL, 58, NULL, NULL, NULL, 0, 1, 54);
