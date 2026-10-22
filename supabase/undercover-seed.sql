-- =====================================================================
--  Under Cover — kezdő tartalom (seed)
--  Az undercover.sql UTÁN, EGYSZER futtasd le a Supabase SQL Editorban.
--  Csak üres táblákba ír (újrafuttatva nem írja felül a már szerkesztett
--  tartalmat).
--
--  Az első admin: cseréld ki az alábbi e-mail címet a sajátodra!
-- =====================================================================

insert into undercover.admins (email) values (lower('admin@example.com'))
on conflict (email) do nothing;

insert into undercover.settings (key, value) values ('hero', '{"badge": "K-Pop Tánciskola", "leadBefore": "Saját stúdiónkban tanulhatod meg kedvenc előadóid koreográfiáit, fejlesztheted a tánctudásodat, és olyan emberekkel találkozhatsz, akik ugyanazért rajonganak, mint te.", "leadHighlight": "", "leadAfter": "", "primaryCtaLabel": "Csatlakozz most", "secondaryCtaLabel": "Órarendünk", "videoPath": null, "videoPosterPath": null}'::jsonb)
on conflict (key) do nothing;

insert into undercover.settings (key, value) values ('about', '{"titleLine1": "Több mint tánc.", "titleLine2": "Ez egy életérzés.", "paragraph": "Az Under Cover Magyarország első K-pop tánciskolájaként 2023 óta hozza közelebb a koreai popzene és tánc világát a hazai rajongókhoz.\n\nAz évek során saját közösséget építettünk, és létrehoztunk egy olyan táncos otthont, ahol a K-pop iránti szenvedély valódi élményekké válik.\n\nSaját stúdiónkban nemcsak kedvenc előadóid koreográfiáit tanulhatod meg, hanem fejlesztheted a tánctechnikádat, az előadásmódodat és az önbizalmadat is.\n\nNálunk azonban a K-pop élmény nem ér véget a táncórák után! Tánctáboraink, random dance eseményeink és évente kétszer megrendezett táncgáláink lehetőséget adnak arra, hogy új barátokat szerezz, közös élményeket gyűjts, és színpadon is megmutasd, mennyit fejlődtél.", "highlight": "Ez a mi közösségünk. És itt neked is helyed van.", "stats": [], "imagePath": "/studionk.jpg", "imageAlt": "Under Cover stúdió — fellépés a színpadon"}'::jsonb)
on conflict (key) do nothing;

insert into undercover.settings (key, value) values ('footer', '{"email": "kpoptanciskola@gmail.com", "phone": "+36 (30) 870-7306", "locations": [{"text": "MD Dance Studio – Opera: 6. kerület, Hajós utca 1.", "note": "Opera metrómegállótól 2 percnyi sétára található"}], "socials": [{"label": "IG", "href": "https://www.instagram.com/under_cover_kpop"}, {"label": "TK", "href": "https://www.tiktok.com/@under_cover_kpop"}, {"label": "FB", "href": "https://www.facebook.com/undercoverkpop"}], "copyright": "© 2026 Under Cover Dance Academy", "tagline": "Built for the New Generation"}'::jsonb)
on conflict (key) do nothing;

insert into undercover.settings (key, value) values ('form_options', '{"experience": ["Még nem", "Igen, kezdő szinten", "Igen, már 1-2 évet", "Igen, versenyszerűen"]}'::jsonb)
on conflict (key) do nothing;

insert into undercover.settings (key, value) values ('price_notes', '{"notes": [{"mark": "*", "text": "A havi bérletek az adott naptári hónapra érvényesek."}, {"mark": "**", "text": "A 4 alkalmas bérlet az aktiválástól számított 30 napon belül használható fel."}, {"mark": "", "text": "Fizethetsz készpénzzel, bankkártyával, átutalással vagy az Appban."}]}'::jsonb)
on conflict (key) do nothing;

insert into undercover.settings (key, value) values ('privacy', '{"text": "MINTA — az adatkezelő adatait, a weboldal címét és az adatfeldolgozókat véglegesítés előtt ellenőrizni kell. (Ezt a bekezdést utána törölheted.)\n\n# A tájékoztató célja, hatálya, irányadó jogszabályok\n\nJelen tájékoztató célja, hogy rögzítse az adatkezelő által alkalmazott adatvédelmi és adatkezelési elveket, valamint az adatkezelő adatvédelmi és adatkezelési politikáját, amelyet magára nézve kötelezőnek ismer el. A tájékoztató az [undercover.hu] weboldalon keresztül megvalósuló adatkezelésekre — elsősorban a táncórákra történő jelentkezésre — vonatkozik, és visszavonásig érvényes.\n\nAz adatkezelés során az adatkezelő az alábbi jogszabályok szerint jár el:\n\n- az Európai Parlament és a Tanács (EU) 2016/679 rendelete (általános adatvédelmi rendelet, GDPR);\n- az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény (Infotv.);\n- a Polgári Törvénykönyvről szóló 2013. évi V. törvény (Ptk.);\n- a gazdasági reklámtevékenység alapvető feltételeiről és egyes korlátairól szóló 2008. évi XLVIII. törvény (Grtv.).\n\n# Az adatkezelő\n\nNév: Xoa98 Kft.\nSzékhely: 1115 Budapest, Tétényi út 10/c.\nAdószám: 12372845-2-43\nE-mail: masterdancetanciskola@gmail.com\nTelefon: +36 (30) 633-6682\nAdatvédelmi felelős: Tran Ba Duy Phuong\nWeboldal: [undercover.hu]\n\n# Fogalmak\n\n- Személyes adat: azonosított vagy azonosítható természetes személyre (érintett) vonatkozó bármely információ.\n- Adatkezelés: a személyes adatokon végzett bármely művelet — gyűjtés, rögzítés, tárolás, felhasználás, továbbítás, törlés stb.\n- Adatkezelő: aki a személyes adatok kezelésének céljait és eszközeit meghatározza.\n- Adatfeldolgozó: aki az adatkezelő nevében személyes adatokat kezel.\n- Hozzájárulás: az érintett akaratának önkéntes, konkrét, tájékoztatáson alapuló és egyértelmű kinyilvánítása.\n- Adatvédelmi incidens: a biztonság olyan sérülése, amely a személyes adatok véletlen vagy jogellenes megsemmisítését, elvesztését, módosítását, jogosulatlan közlését vagy az azokhoz való jogosulatlan hozzáférést eredményezi.\n\n# Az adatkezelés elvei\n\nA személyes adatok kezelése során az adatkezelő gondoskodik arról, hogy az adatok:\n\n- kezelése jogszerű, tisztességes és az érintett számára átlátható legyen;\n- gyűjtése csak meghatározott, egyértelmű és jogszerű célból történjen (célhoz kötöttség);\n- a cél szempontjából megfelelőek, relevánsak és szükségesek legyenek (adattakarékosság);\n- pontosak és szükség esetén naprakészek legyenek;\n- tárolása csak a cél eléréséhez szükséges ideig történjen;\n- megfelelő biztonságát technikai és szervezési intézkedésekkel biztosítsa.\n\nAz adatkezelő felelős ezen elvek betartásáért, és képes annak igazolására (elszámoltathatóság).\n\n# A kezelt adatok köre és az adatkezelés célja\n\nTáncórára jelentkezés\n\nKezelt adatok: teljes név, e-mail cím, telefonszám, születési dátum, a választott órák (terem, nap, időpont), korábbi tánctapasztalat (ha megadja), a megjegyzés mezőben önként megadott adatok\n16 év alatti jelentkezőnél: a szülő / törvényes képviselő neve és e-mail címe\nCél: a jelentkezés fogadása, a jelentkezővel (illetve szülőjével) való kapcsolattartás, a csoportba sorolás és az órák szervezése\nJogalap: az érintett önkéntes hozzájárulása — GDPR 6. cikk (1) bek. a) pont\nIdőtartam: az utolsó kapcsolatfelvételtől számított 1 év, vagy a hozzájárulás visszavonásáig\n\n16 év alatti jelentkező esetén a hozzájárulást a szülői felügyeletet gyakorló személy adja meg, ezért az űrlap ilyenkor a szülő adatait is kéri.\n\nKapcsolatfelvétel (e-mail, telefon, közösségi média)\n\nKezelt adatok: név, e-mail cím, telefonszám, az üzenetben megadott adatok\nCél: a megkeresések megválaszolása, kapcsolattartás\nJogalap: az érintett önkéntes hozzájárulása — GDPR 6. cikk (1) bek. a) pont\nIdőtartam: az utolsó kapcsolatfelvételtől számított 1 év, vagy a hozzájárulás visszavonásáig\n\n# Az adatkezelés módja\n\nAz adatokat az érintett maga adja meg a weboldal jelentkezési űrlapján. Az adatkezelő az adatokat elektronikus úton kezeli, azokat csak a fenti célokra használja fel, és nem hoz kizárólag automatizált adatkezelésen alapuló döntést. A jelentkezés a két jelölőnégyzet („Elolvastam és elfogadom…” és „Hozzájárulok…”) bepipálásával és az űrlap elküldésével történik; a pipák nélkül a jelentkezés nem küldhető el.\n\n# Technikai adatok és sütik (cookie-k)\n\nA weboldal a működéshez szükséges, a felhasználói élményt javító, valamint statisztikai célú sütiket használhat. A statisztikai sütik (pl. Google Analytics, „_ga”) összesített, személyes azonosításra nem alkalmas adatokat gyűjtenek a látogatottságról. A sütik a böngésző beállításaiban bármikor törölhetők vagy letilthatók; ez a weboldal egyes funkcióinak működését befolyásolhatja.\n\n# Adattovábbítás\n\nAz adatkezelő a személyes adatokat harmadik fél részére csak az érintett előzetes hozzájárulásával vagy jogszabályi kötelezettség alapján (pl. hatósági megkeresésre) továbbítja.\n\n# Adatfeldolgozók\n\nTárhelyszolgáltató: Rackforest Kft. — 1132 Budapest, Victor Hugo u. 18–22.\nWeboldal karbantartás, adatmentés: [a fejlesztő / üzemeltető neve, címe]\nLátogatottság-mérés: Google Ireland Ltd. — Gordon House, Barrow Street, Dublin 4, Írország (Google Analytics)\n\n# Külső szolgáltatók\n\nA weboldal hivatkozásokat tartalmazhat közösségi média felületekre (Instagram, TikTok, Facebook) és beágyazott tartalmakat (pl. videó, térkép) jeleníthet meg. Ezeken a felületeken az adott szolgáltató saját adatkezelési szabályzata az irányadó.\n\n# Adatbiztonság, az adatok megismerése\n\nAz adatkezelő megfelelő technikai és szervezési intézkedésekkel védi az adatokat a jogosulatlan hozzáférés, megváltoztatás, továbbítás, nyilvánosságra hozatal, törlés vagy megsemmisülés ellen. Az adatokhoz csak az adatkezelő erre feljogosított munkatársai, illetve oktatói férhetnek hozzá, kizárólag a fenti célok érdekében.\n\n# Az adatkezelés időtartama, törlés\n\nA személyes adatokat az adatkezelő az 5. pontban megjelölt ideig kezeli. Az adatokat törli, ha kezelésük jogellenes, az adatkezelés célja megszűnt, a tárolási idő lejárt, az érintett visszavonja a hozzájárulását vagy törlést kér, illetve ha ezt bíróság vagy hatóság elrendeli.\n\n# Az érintett jogai\n\n- Tájékoztatás és hozzáférés: tájékoztatást kérhet a róla kezelt adatokról.\n- Helyesbítés: kérheti a pontatlan adatok javítását.\n- Törlés („elfeledtetés”): kérheti adatai törlését.\n- Korlátozás: kérheti az adatkezelés korlátozását.\n- Tiltakozás: tiltakozhat személyes adatainak kezelése ellen.\n- Adathordozhatóság: kérheti adatai tagolt, géppel olvasható formában történő kiadását.\n- A hozzájárulás visszavonása: hozzájárulását bármikor visszavonhatja; ez nem érinti a visszavonás előtti adatkezelés jogszerűségét.\n\nKérelmét postai úton vagy e-mailben (masterdancetanciskola@gmail.com) nyújthatja be. Az adatkezelő a kérelemre legkésőbb egy hónapon belül válaszol; ez a határidő indokolt esetben további két hónappal meghosszabbítható, amiről az érintettet tájékoztatja.\n\n# Jogorvoslati lehetőségek\n\nHa úgy érzi, hogy személyes adatainak kezelése sérti a jogait, kérjük, először forduljon közvetlenül az adatkezelőhöz. Panaszával a felügyeleti hatósághoz is fordulhat:\n\nHatóság: Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)\nCím: 1055 Budapest, Falk Miksa utca 9–11.\nTelefon: +36 (1) 391-1400\nE-mail: ugyfelszolgalat@naih.hu\nWeboldal: https://naih.hu\n\nJogainak megsértése esetén bírósághoz is fordulhat; a per — az érintett választása szerint — a lakóhelye vagy tartózkodási helye szerinti törvényszék előtt is megindítható.\n"}'::jsonb)
on conflict (key) do nothing;

do $$
declare r uuid;
begin
  if exists (select 1 from undercover.rooms) then return; end if;
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

do $$
begin
  if exists (select 1 from undercover.prices) then return; end if;
  insert into undercover.prices (name, price, note, sort) values
    ('Órajegy', '4 000 Ft', '', 0),
    ('Havi bérlet — 1 csoport', '20 000 Ft', '*', 1),
    ('Havi bérlet — 2 csoport', '30 000 Ft', '*', 2),
    ('Korlátlan havi bérlet', '36 000 Ft', '*', 3),
    ('4 alkalmas bérlet', '14 000 Ft', '**', 4);
end $$;

-- Hírek: a hír szövegét $html$ … $html$ közé írjuk (így az idézőjelekkel nincs gond).
insert into undercover.news (published_on, slug, title, excerpt, placeholder_label, body_html)
select d::date, s, t, e, p, b from (values
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
)) as v(d, s, t, e, p, b)
where not exists (select 1 from undercover.news);
