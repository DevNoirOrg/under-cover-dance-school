-- =====================================================================
--  Under Cover — 2026-10-22: új tartalom + sémamódosítások
--
--  A Supabase SQL Editorban EGYSZER futtasd le (a már meglévő
--  undercover séma után). Újrafuttatható, de a tartalmi rész újra
--  felülírja az órarendet, a híreket, az árakat és a szövegeket!
--
--  Séma:
--   - órarend: termenként 1–3 oszlop (eddig fixen 3)
--   - hírek: saját oldal (slug) és teljes szöveg (body_html)
--   - jelentkezés: teljes név + telefonszám; a „kezdés” megszűnik,
--     a tánctapasztalat nem kötelező; két külön hozzájárulás
--  Tartalom: az ügyfél 2026. októberi anyaga alapján.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
--  SÉMA
-- ---------------------------------------------------------------------

-- Órarend: 1–3 oszlop termenként
alter table undercover.rooms drop constraint if exists rooms_column_headings_check;
alter table undercover.rooms
  add constraint rooms_column_headings_check
  check (array_length(column_headings, 1) between 1 and 3);

-- Hírek: saját oldal
alter table undercover.news add column if not exists slug text;
alter table undercover.news add column if not exists body_html text not null default '';
update undercover.news set slug = id::text where slug is null or slug = '';
alter table undercover.news alter column slug set not null;
create unique index if not exists news_slug_key on undercover.news (slug);

-- Jelentkezések: teljes név, telefon, két hozzájárulás
alter table undercover.applications add column if not exists nev text;
alter table undercover.applications add column if not exists telefon text not null default '';
alter table undercover.applications add column if not exists privacy_ack_at timestamptz;
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'undercover' and table_name = 'applications' and column_name = 'vezeteknev'
  ) then
    update undercover.applications
      set nev = trim(coalesce(vezeteknev, '') || ' ' || coalesce(keresztnev, ''))
      where nev is null;
    alter table undercover.applications drop column vezeteknev;
    alter table undercover.applications drop column keresztnev;
  end if;
end $$;
update undercover.applications set nev = '' where nev is null;
alter table undercover.applications alter column nev set not null;
alter table undercover.applications alter column tapasztalat drop not null;
alter table undercover.applications alter column kezdes drop not null;

-- ---------------------------------------------------------------------
--  TARTALOM — szövegek
-- ---------------------------------------------------------------------

-- Hero (a feltöltött videó megmarad)
update undercover.settings set
  value = value || jsonb_build_object(
    'badge', 'K-Pop Tánciskola',
    'leadBefore', 'Saját stúdiónkban tanulhatod meg kedvenc előadóid koreográfiáit, fejlesztheted a tánctudásodat, és olyan emberekkel találkozhatsz, akik ugyanazért rajonganak, mint te.',
    'leadHighlight', '',
    'leadAfter', '',
    'primaryCtaLabel', 'Csatlakozz most',
    'secondaryCtaLabel', 'Órarendünk'),
  updated_at = now()
where key = 'hero';

-- Rólunk (a kép megmarad; a számok nem kellenek)
update undercover.settings set
  value = value || jsonb_build_object(
    'titleLine1', 'Több mint tánc.',
    'titleLine2', 'Ez egy életérzés.',
    'paragraph', concat_ws(E'\n\n',
      'Az Under Cover Magyarország első K-pop tánciskolájaként 2023 óta hozza közelebb a koreai popzene és tánc világát a hazai rajongókhoz.',
      'Az évek során saját közösséget építettünk, és létrehoztunk egy olyan táncos otthont, ahol a K-pop iránti szenvedély valódi élményekké válik.',
      'Saját stúdiónkban nemcsak kedvenc előadóid koreográfiáit tanulhatod meg, hanem fejlesztheted a tánctechnikádat, az előadásmódodat és az önbizalmadat is.',
      'Nálunk azonban a K-pop élmény nem ér véget a táncórák után! Tánctáboraink, random dance eseményeink és évente kétszer megrendezett táncgáláink lehetőséget adnak arra, hogy új barátokat szerezz, közös élményeket gyűjts, és színpadon is megmutasd, mennyit fejlődtél.'),
    'highlight', 'Ez a mi közösségünk. És itt neked is helyed van.',
    'stats', '[]'::jsonb),
  updated_at = now()
where key = 'about';

-- Lábléc: Elérhetőségek + közösségi linkek
update undercover.settings set
  value = (value - 'locations') || jsonb_build_object(
    'email', 'kpoptanciskola@gmail.com',
    'phone', '+36 (30) 870-7306',
    'locations', jsonb_build_array(
      jsonb_build_object(
        'text', 'MD Dance Studio – Opera: 6. kerület, Hajós utca 1.',
        'note', 'Opera metrómegállótól 2 percnyi sétára található')),
    'socials', jsonb_build_array(
      jsonb_build_object('label', 'IG', 'href', 'https://www.instagram.com/under_cover_kpop'),
      jsonb_build_object('label', 'TK', 'href', 'https://www.tiktok.com/@under_cover_kpop'),
      jsonb_build_object('label', 'FB', 'href', 'https://www.facebook.com/undercoverkpop'))),
  updated_at = now()
where key = 'footer';

-- Jelentkezési form: csak a tánctapasztalat opciói maradnak
update undercover.settings set
  value = jsonb_build_object('experience', jsonb_build_array(
    'Még nem', 'Igen, kezdő szinten', 'Igen, már 1-2 évet', 'Igen, versenyszerűen')),
  updated_at = now()
where key = 'form_options';

-- Árak megjegyzései
update undercover.settings set
  value = jsonb_build_object('notes', jsonb_build_array(
    jsonb_build_object('mark', '*', 'text', 'A havi bérletek az adott naptári hónapra érvényesek.'),
    jsonb_build_object('mark', '**', 'text', 'A 4 alkalmas bérlet az aktiválástól számított 30 napon belül használható fel.'),
    jsonb_build_object('mark', '', 'text', 'Fizethetsz készpénzzel, bankkártyával, átutalással vagy az Appban.'))),
  updated_at = now()
where key = 'price_notes';

-- Adatkezelési tájékoztató: a kezelt adatok és a két jelölőnégyzet
update undercover.settings set
  value = jsonb_build_object('text',
    replace(replace(replace(value->>'text',
      'Kezelt adatok: vezetéknév, keresztnév, e-mail cím, születési dátum, a választott órák (nap, időpont, helyszín), korábbi tánctapasztalat, a kezdés tervezett ideje, a megjegyzés mezőben önként megadott adatok',
      'Kezelt adatok: teljes név, e-mail cím, telefonszám, születési dátum, a választott órák (terem, nap, időpont), korábbi tánctapasztalat (ha megadja), a megjegyzés mezőben önként megadott adatok'),
      'A jelentkezés a „Hozzájárulok…” jelölőnégyzet bepipálásával és az űrlap elküldésével történik; pipa nélkül a jelentkezés nem küldhető el.',
      'A jelentkezés a két jelölőnégyzet („Elolvastam és elfogadom…” és „Hozzájárulok…”) bepipálásával és az űrlap elküldésével történik; a pipák nélkül a jelentkezés nem küldhető el.'),
      '(Instagram, TikTok, YouTube)',
      '(Instagram, TikTok, Facebook)')),
  updated_at = now()
where key = 'privacy';

-- ---------------------------------------------------------------------
--  TARTALOM — órarend (kpoptanciskola.com/orarend)
-- ---------------------------------------------------------------------
delete from undercover.rooms;

do $$
declare r uuid;
begin
  insert into undercover.rooms (slug, name, short_name, column_headings, min_height_px, sort)
  values ('kozepes', 'Közepes terem', 'Közepes', array['Hétfő · Szerda', 'Kedd · Csütörtök'], 220, 0)
  returning id into r;
  insert into undercover.classes (room_id, col, sort, title, subtitle, chip) values
    (r, 0, 0, '16:00–17:00 · Kezdő Tini K-pop', 'Jula · 12+', 'Közepes · H–Sz 16:00'),
    (r, 0, 1, '17:00–18:00 · Új Kezdő Tini K-pop', 'Gyöngyi · 12+', 'Közepes · H–Sz 17:00'),
    (r, 1, 0, '16:00–17:00 · Gyerek K-pop', 'Zsófi · 7+', 'Közepes · K–Cs 16:00'),
    (r, 1, 1, '17:00–18:00 · Tini K-pop (angolul)', 'Hiromi · 12+', 'Közepes · K–Cs 17:00'),
    (r, 1, 2, '19:00–20:00 · ÚJ K-pop', 'Gyöngyi', 'Közepes · K–Cs 19:00');

  insert into undercover.rooms (slug, name, short_name, column_headings, min_height_px, sort)
  values ('nagy', 'Nagy terem', 'Nagy', array['Hétfő · Szerda', 'Kedd · Csütörtök'], 220, 1)
  returning id into r;
  insert into undercover.classes (room_id, col, sort, title, subtitle, chip) values
    (r, 0, 0, '16:00–17:00 · Kezdő Tini K-pop', 'Nóri · 12+', 'Nagy · H–Sz 16:00'),
    (r, 0, 1, '17:00–18:00 · Közép-haladó K-pop', 'Nóri', 'Nagy · H–Sz 17:00'),
    (r, 0, 2, '18:00–19:00 · Tini K-pop', 'Jula · 12+', 'Nagy · H–Sz 18:00'),
    (r, 0, 3, '19:00–20:00 · Közép-haladó K-pop', 'Jula', 'Nagy · H–Sz 19:00'),
    (r, 0, 4, '20:00–21:00 · Felnőtt K-pop', 'Jula · Felnőtt', 'Nagy · H–Sz 20:00'),
    (r, 1, 0, '16:00–17:00 · I. Tini K-pop', 'Nóri · 12+', 'Nagy · K–Cs 16:00'),
    (r, 1, 1, '17:00–18:00 · II. Tini K-pop', 'Nóri · 12+', 'Nagy · K–Cs 17:00'),
    (r, 1, 2, '18:00–19:00 · International K-pop', 'Hiromi', 'Nagy · K–Cs 18:00');
end $$;

-- ---------------------------------------------------------------------
--  TARTALOM — árak
-- ---------------------------------------------------------------------
delete from undercover.prices;
insert into undercover.prices (name, price, note, sort) values
  ('Órajegy', '4 000 Ft', '', 0),
  ('Havi bérlet — 1 csoport', '20 000 Ft', '*', 1),
  ('Havi bérlet — 2 csoport', '30 000 Ft', '*', 2),
  ('Korlátlan havi bérlet', '36 000 Ft', '*', 3),
  ('4 alkalmas bérlet', '14 000 Ft', '**', 4);

-- ---------------------------------------------------------------------
--  TARTALOM — hírek (a régi oldal 3 legfrissebb híre; képek később)
-- ---------------------------------------------------------------------
delete from undercover.news;
insert into undercover.news (published_on, slug, title, excerpt, placeholder_label, body_html) values
(
  '2026-10-22',
  'ket-uj-k-pop-csoport-indul-gyongyivel',
  'Két új K-pop csoport indul Gyöngyivel az Under Covernél!',
  'Új tanárral és két új csoporttal bővül az Under Cover órarendje: kezdő tini csoport és 16+ K-pop csoport Gyöngyivel.',
  'Új csoportok',
  $html$<p>Sziasztok K-pop Rajongók! Új tanárral és két új csoporttal bővül az Under Cover órarendje!</p>
<p><strong>Gyöngyi</strong> a kezdő tiniket és az idősebb K-pop fanokat is várja, rengeteg energiával, jó hangulattal és a kedvenc K-pop koreóitokkal!</p>
<p>Csajos és srácos táncok vegyesen, pörgős zenék és felszabadult hangulat – itt biztosan nem lesz hiány a jó vibe-okból!</p>
<h2>Órák időpontjai</h2>
<ul>
<li><strong>Kezdő tini csoport:</strong> hétfő és kedd, 17:00–18:00</li>
<li><strong>K-pop csoport (16+):</strong> kedd és csütörtök, 19:00–20:00</li>
</ul>
<p><strong>Helyszín:</strong> Under Cover K-pop Tánciskola<br><strong>Jelentkezés:</strong> <a href="/#orarend">az órarendünkben</a></p>
<p>Válaszd ki a hozzád illő csoportot, és csapj le a helyedre! Várunk szeretettel!</p>$html$
),
(
  '2026-09-20',
  'elindult-k-pop-tanc-gyerekcsoportunk',
  'Elindult K-pop tánc gyerekcsoportunk!',
  '7 éves kortól várunk minden gyereket, aki szereti a K-pop zenét — kezdőket is, a jelentkezés folyamatos.',
  'Gyerekcsoport',
  $html$<p>Sziasztok K-pop rajongók!</p>
<p>Örömmel jelentjük be, hogy elindult K-pop tánc gyerekcsoportunk az Under Covernél! A csoportba <strong>7 éves kortól</strong> várunk minden gyereket, aki szereti a K-pop zenét, szívesen táncolna a kedvenc előadói dalaira, és szeretne egy vidám, támogató közösséghez tartozni.</p>
<p>Az órákon népszerű K-pop koreográfiákat tanulunk, miközben a gyerekek játékosan fejleszthetik ritmusérzéküket, koordinációjukat és tánctudásukat. Természetesen a jó hangulat, a közös élmények és a tánc szeretete sem maradhat el!</p>
<p>Kezdőket is szeretettel várunk, így akkor is bátran lehet csatlakozni, ha gyermeked még soha nem járt táncórára. A legfontosabb a lelkesedés és a K-pop iránti szeretet! A jelentkezés folyamatos, így év közben is van lehetőség csatlakozni a csoporthoz.</p>
<p><strong>Helyszín:</strong> Under Cover K-pop Tánciskola, 1065 Budapest, Hajós utca 1. – az Opera metrómegállótól néhány perc sétára</p>
<p>Ha gyermeked otthon már most is a kedvenc K-pop dalaira táncol, itt az alkalom, hogy egy igazi K-pop táncórán is kipróbálja magát!</p>
<p>Várunk minden 7 éves vagy idősebb K-pop rajongót! Találkozunk a táncteremben!</p>
<p>Üdv,<br>UC Team</p>$html$
),
(
  '2026-08-25',
  'indul-a-2026-os-k-pop-tancos-tanev',
  'Indul a 2026-os K-pop táncos tanév az Under Covernél!',
  'Szeptember 7-én indul az új tanév! A beiratkozás minden régi és új tanulónk számára szükséges.',
  'Tanévkezdés',
  $html$<p>Sziasztok Under Cover Táncosok!</p>
<p>Reméljük, mindenkinek élményekkel és pihenéssel telt a nyara! Hamarosan újra megtelik a terem zenével és tánccal, ugyanis indul a 2026-os K-pop táncos tanév az Under Covernél!</p>
<p>Idén is rengeteg új koreográfiával, a kedvenc K-pop előadóitok legfrissebb dalaival és természetesen a megszokott UC közösséggel várunk benneteket.</p>
<p><strong>Kezdés: szeptember 7.</strong></p>
<p>Így az iskolai órarendek véglegesítése után mindenkinek van lehetősége kiválasztani és összeegyeztetni a számára megfelelő csoportokat.</p>
<p><strong>Helyszín:</strong><br>Under Cover K-pop Tánciskola<br><a href="https://maps.app.goo.gl/GDugKsTo5271KQXN7" target="_blank" rel="noopener noreferrer">1065 Budapest, Hajós utca 1. – Opera Metró Megálló</a></p>
<p>Az új tanévben néhány változás is érkezik az órarendünkben, ezért kérünk benneteket, hogy beiratkozás előtt mindenképpen nézzétek át az aktuális csoportokat és időpontokat.</p>
<p>A beiratkozás minden régi és új tanulónk számára szükséges, és <a href="/#orarend">az órarendünkön keresztül</a> tudjátok leadni.</p>
<p>A beiratkozást követően bekerültök a Dancepass rendszerébe, ahol megtaláljátok az óráinkat és kezelhetitek a jelentkezéseiteket.</p>
<p>Fontos, hogy a beiratkozásotok csak akkor válik véglegessé, ha a Dancepass felületén az első órára is rányomtok a jelentkezésre:<br><a href="https://undercover.dancepass.app/events" target="_blank" rel="noopener noreferrer">https://undercover.dancepass.app/events</a></p>
<p>Az óráink létszáma limitált, ezért ne hagyjátok az utolsó pillanatra – csapjatok le a helyekre, mielőtt betelnek a csoportok!</p>
<p>Nagyon várjuk, hogy újra együtt táncoljunk, találkozunk szeptember 7-től!</p>
<p>Üdv,<br>UC Team</p>$html$
);

commit;
