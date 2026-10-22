-- =====================================================================
--  Under Cover — adatbázis séma (Supabase / Postgres)
--
--  A közös (MD-vel megosztott) Supabase projektben egy KÜLÖN SÉMÁBAN
--  (`undercover`) él minden tábla. Az app közvetlenül, szerveroldalon
--  kapcsolódik a Postgreshez (DATABASE_URL), ezért a sémát NEM kell a
--  Supabase API-nak (PostgREST) kiajánlani. A sorszintű védelem (RLS) be
--  van kapcsolva szabályok nélkül, így az anon / authenticated kulcsokkal
--  semmi sem olvasható ki.
--
--  Biztonságosan újrafuttatható. Utána egyszer: undercover-seed.sql.
-- =====================================================================

create schema if not exists undercover;
revoke all on schema undercover from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on schema undercover from anon, authenticated';
  end if;
end $$;

-- ---------------------------------------------------------------------
--  Adminok — csak az itt szereplő e-mail címek léphetnek be az adminba.
-- ---------------------------------------------------------------------
create table if not exists undercover.admins (
  email      text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
--  Egyedi (egy példányos) tartalmak: hero, about, footer, form_options,
--  price_notes, privacy. Az érték JSON, a szerkezetét az app ellenőrzi.
-- ---------------------------------------------------------------------
create table if not exists undercover.settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- ---------------------------------------------------------------------
--  Ki és mikor módosított utoljára egy-egy tartalmi részt (admin kijelzés).
-- ---------------------------------------------------------------------
create table if not exists undercover.edit_log (
  section    text primary key,
  updated_at timestamptz not null default now(),
  updated_by text not null
);

-- ---------------------------------------------------------------------
--  Órarend
-- ---------------------------------------------------------------------
create table if not exists undercover.rooms (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  short_name      text not null,
  column_headings text[] not null check (array_length(column_headings, 1) between 1 and 3),
  min_height_px   integer not null default 220,
  sort            integer not null default 0,
  updated_at      timestamptz not null default now(),
  updated_by      text
);

create table if not exists undercover.classes (
  id       uuid primary key default gen_random_uuid(),
  room_id  uuid not null references undercover.rooms(id) on delete cascade,
  col      smallint not null check (col between 0 and 2),
  sort     integer not null default 0,
  title    text not null,
  subtitle text not null default '',
  chip     text not null
);
create index if not exists classes_room_idx on undercover.classes (room_id, col, sort);

-- ---------------------------------------------------------------------
--  Hírek
-- ---------------------------------------------------------------------
create table if not exists undercover.news (
  id                uuid primary key default gen_random_uuid(),
  published_on      date not null default current_date,
  slug              text not null unique,
  title             text not null,
  excerpt           text not null default '',
  body_html         text not null default '',
  image_path        text,
  image_alt         text,
  placeholder_label text not null default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  updated_by        text
);

-- ---------------------------------------------------------------------
--  Árak
-- ---------------------------------------------------------------------
create table if not exists undercover.prices (
  id    uuid primary key default gen_random_uuid(),
  name  text not null,
  price text not null,
  note  text not null default '' check (note in ('', '*', '**')),
  sort  integer not null default 0
);

-- ---------------------------------------------------------------------
--  Jelentkezések
-- ---------------------------------------------------------------------
create table if not exists undercover.applications (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  status            text not null default 'uj'
                    check (status in ('uj', 'felvettuk', 'elutasitva', 'archivalt')),
  nev               text not null,
  email             text not null,
  telefon           text not null default '',
  szuletes          date not null,
  szulo_nev         text,
  szulo_email       text,
  tapasztalat       text,
  kezdes            text,
  megjegyzes        text not null default '',
  classes           text[] not null,
  consent_at        timestamptz not null,
  privacy_ack_at    timestamptz,
  ip_hash           text,
  admin_note        text not null default '',
  status_updated_at timestamptz,
  status_updated_by text
);
create index if not exists applications_created_idx on undercover.applications (created_at desc);
create index if not exists applications_ip_idx on undercover.applications (ip_hash, created_at);

-- ---------------------------------------------------------------------
--  RLS: be, szabályok nélkül → a Supabase API-n át semmi sem érhető el.
-- ---------------------------------------------------------------------
alter table undercover.admins       enable row level security;
alter table undercover.edit_log     enable row level security;
alter table undercover.settings     enable row level security;
alter table undercover.rooms        enable row level security;
alter table undercover.classes      enable row level security;
alter table undercover.news         enable row level security;
alter table undercover.prices       enable row level security;
alter table undercover.applications enable row level security;

-- ---------------------------------------------------------------------
--  Fájltároló (Storage): nyilvánosan olvasható "undercover" bucket a
--  képeknek és a hero videónak. Feltölteni csak az admin tud (az app
--  szerveroldalon ad hozzá egyszer használatos feltöltési linket).
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'storage' and table_name = 'buckets') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('undercover', 'undercover', true, 52428800,
            array['image/webp', 'image/jpeg', 'image/png', 'video/mp4'])
    on conflict (id) do update
      set public = excluded.public,
          file_size_limit = excluded.file_size_limit,
          allowed_mime_types = excluded.allowed_mime_types;
  end if;
end $$;

-- ---------------------------------------------------------------------
--  Megőrzés: az 1 évnél régebbi jelentkezések automatikus törlése
--  (ahogy az adatkezelési tájékoztató írja). Ehhez a pg_cron bővítmény
--  kell: Supabase → Integrations → Cron → Enable. Ha nincs bekapcsolva,
--  ez a rész csendben kimarad — bekapcsolás után futtasd újra a fájlt.
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'undercover-applications-retention',
      '15 3 * * *',
      $job$delete from undercover.applications where created_at < now() - interval '1 year'$job$
    );
  end if;
end $$;
