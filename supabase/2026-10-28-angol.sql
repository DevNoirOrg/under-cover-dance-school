-- =====================================================================
--  Under Cover — 2026-10-28: angol nyelvű változat (kétnyelvű oldal)
--
--  A Supabase SQL Editorban futtasd le (a meglévő undercover séma után).
--  Biztonságosan újrafuttatható, a meglévő (magyar) tartalomhoz nem nyúl.
--
--   - órarend, hírek, árak: angol mezők (üres = az angol oldalon a magyar látszik)
--   - jelentkezések: milyen nyelvű oldalon jelentkezett (hu / en)
--  Az egyedi szövegek (hero, Rólunk, lábléc, űrlap, ár-megjegyzések) angol
--  változata a settings tábla JSON értékében van („en” mezők) — ehhez nem kell
--  sémamódosítás.
-- =====================================================================

begin;

alter table undercover.rooms add column if not exists name_en text not null default '';
alter table undercover.rooms add column if not exists short_name_en text not null default '';
alter table undercover.rooms add column if not exists column_headings_en text[] not null default '{}';

alter table undercover.classes add column if not exists title_en text not null default '';
alter table undercover.classes add column if not exists subtitle_en text not null default '';
alter table undercover.classes add column if not exists chip_en text not null default '';

alter table undercover.news add column if not exists title_en text not null default '';
alter table undercover.news add column if not exists excerpt_en text not null default '';
alter table undercover.news add column if not exists body_html_en text not null default '';
alter table undercover.news add column if not exists image_alt_en text not null default '';
alter table undercover.news add column if not exists placeholder_label_en text not null default '';

alter table undercover.prices add column if not exists name_en text not null default '';
alter table undercover.prices add column if not exists price_en text not null default '';

alter table undercover.applications add column if not exists lang text not null default 'hu';
alter table undercover.applications drop constraint if exists applications_lang_check;
alter table undercover.applications add constraint applications_lang_check check (lang in ('hu', 'en'));

commit;
