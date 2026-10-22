# Under Cover — K-pop Dance Academy

Next.js (App Router) + TypeScript + Tailwind CSS v4 weboldal admin felülettel.
A publikus oldal kinézete 1:1 a `md designs/under_cover_18` design alapján készült;
minden tartalma az adminból szerkeszthető.

- **Publikus oldal:** `/`, `/hirek`, `/hirek/<webcím>`, `/adatkezeles` — statikus, gyorsítótárazott; admin mentéskor azonnal frissül.
- **Admin:** `/admin` (vagy `admin.<domain>`, ha be van állítva az `ADMIN_HOST`).
- **Adatok:** Supabase (Postgres + Auth + Storage), a közös (MD-vel megosztott) projekt
  `undercover` sémájában.
- **E-mail:** Resend (új jelentkezés értesítő, opcionálisan visszaigazolás a jelentkezőnek).

---

## 1. Beállítás (egyszer)

### 1.1 Supabase — adatbázis

1. Supabase → **SQL Editor** → futtasd le a `supabase/undercover.sql` fájlt.
   (Biztonságosan újrafuttatható; létrehozza az `undercover` sémát, a táblákat és az
   `undercover` Storage bucketet.)
2. Nyisd meg a `supabase/undercover-seed.sql` fájlt, **cseréld ki** benne az
   `admin@example.com` címet a saját e-mail címedre, és futtasd le. Ez feltölti a
   mostani tartalmat (órarend, árak, hírek, szövegek) és felveszi az első admint.
   *(Új telepítésnél ennyi elég — a seed már a 2026. októberi tartalmat tartalmazza.)*
3. **Meglévő adatbázisnál** a változásokat a dátumozott fájlok hozzák (sorrendben, egyszer):
   - `supabase/2026-10-22-tartalom.sql` — 1–3 oszlopos órarend, hírek saját oldallal és
     teljes szöveggel, új jelentkezési mezők (teljes név, telefon, két hozzájárulás), és az
     ügyfél októberi tartalma (hero, rólunk, órarend, hírek, árak, lábléc).
     **Figyelem:** az órarendet, a híreket és az árakat felülírja!
4. *(Ajánlott)* **Integrations → Cron → Enable**, majd futtasd újra az `undercover.sql`-t.
   Ez állítja be, hogy az 1 évnél régebbi jelentkezések automatikusan törlődjenek
   (ahogy az adatkezelési tájékoztató írja).

A sémát **nem** kell kiajánlani a Supabase API-nak — az app közvetlenül, szerveroldalon
kapcsolódik a Postgreshez. A táblákon be van kapcsolva az RLS szabályok nélkül, így a
publikus kulcsokkal semmi sem olvasható ki.

### 1.2 Supabase — belépési kód e-mailben

Az admin belépés jelszó nélküli: egy 6 jegyű kódot kap e-mailben.

1. **Authentication → Emails → Templates → Magic Link**: a sablonba kerüljön bele a kód
   (`{{ .Token }}`). Semleges (mindkét oldalhoz jó) javaslat:
   - Tárgy: `Belépési kódod: {{ .Token }}`
   - Szöveg: `<p>A belépési kódod: <strong style="font-size:22px;letter-spacing:4px">{{ .Token }}</strong></p><p>A kód néhány percig érvényes. Ha nem te kérted, nyugodtan hagyd figyelmen kívül.</p>`
2. **Authentication → Emails → SMTP Settings**: állítsd be a Resend SMTP-t
   (`smtp.resend.com`, port 465, user `resend`, jelszó: Resend API kulcs). A Supabase
   beépített küldője óránként csak pár e-mailt enged.
3. **Authentication → URL Configuration → Redirect URLs**: add hozzá a
   `http://localhost:3000/admin/auth/callback` és (élesben) a
   `https://<domain>/admin/auth/callback` címet. Ez akkor kell, ha a sablon kód helyett
   linket küld (pl. a Supabase alap sablonja): a linkre kattintva is be lehet lépni, ha
   ugyanabban a böngészőben nyitod meg, ahol a kódot kérted.
4. A nyilvános regisztráció (**Allow new users to sign up**) maradhat kikapcsolva: az
   admin felhasználót az app hozza létre a service role kulccsal, amikor egy
   `undercover.admins` táblában szereplő cím kódot kér.

### 1.3 Környezeti változók

Másold a `.env.example`-t `.env.local`-ba (helyi futtatás), és ugyanezeket add meg a
Vercelen is (**Settings → Environment Variables**). A magyarázat a fájlban van.

| Változó | Kötelező | Mire jó |
| --- | --- | --- |
| `DATABASE_URL` | ✔ | Supabase **Transaction pooler** connection string (6543-as port) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✔ | a projekt címe |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✔ | publishable (anon) kulcs |
| `SUPABASE_SERVICE_ROLE_KEY` | ✔ | secret kulcs — feltöltés, admin felhasználó létrehozása |
| `ADMIN_HOST` | | pl. `admin.undercover.hu` — lásd 3. pont |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | | e-mail küldés (nélkülük a jelentkezés ment, csak e-mail nem megy) |
| `APPLICATION_NOTIFY_EMAIL` | | ki kap értesítést új jelentkezésről |
| `APPLICANT_CONFIRMATION_ENABLED` | | `true` = a jelentkező is kap visszaigazolást |
| `NEXT_PUBLIC_SITE_URL` | | az oldal végleges címe (megosztási kép) |
| `IP_HASH_SALT` | | véletlen szöveg az IP-címek álnevesítéséhez |

> A build is olvassa az adatbázist (a főoldal statikusan készül), ezért a Vercelen a
> `DATABASE_URL` a **Build** környezetben is legyen elérhető (alapból az).

## 2. Futtatás

```bash
npm install
npm run dev      # http://localhost:3000  ·  admin: http://localhost:3000/admin
npm run build
npm run lint
```

## 3. Admin subdomain (amikor megvan a domain)

1. Vercel → **Settings → Domains**: add hozzá a fő domaint és az `admin.` subdomaint is
   ugyanehhez a projekthez.
2. Állítsd be az `ADMIN_HOST=admin.<domain>` változót, és deployolj újra.

Ezután az admin csak az `admin.<domain>` címen érhető el (pl. `admin.undercover.hu/orarend`),
a fő domainen az `/admin` 404-et ad. `ADMIN_HOST` nélkül az admin a `/admin` úton van
(fejlesztés, Vercel előnézet). Az admin oldalakat a keresők nem indexelik.

## 4. Az admin felület

| Menü | Mit lehet |
| --- | --- |
| Áttekintés | új jelentkezések száma, ki mit módosított utoljára |
| Jelentkezések | lista státusz szerint (új / felvettük / elutasítva / archivált), részletek, belső megjegyzés, törlés, CSV export |
| Órarend | termek (új is), termenként 1–3 oszlop átírható címmel, órák húzással rendezhetők |
| Árak | tételek (két oszlopban jelennek meg), megjegyzések |
| Hírek | új / szerkesztés / törlés, kártyakép, webcím, a teljes szöveg Word-szerű szerkesztővel (képpel, linkkel) — a főoldalon a 3 legfrissebb látszik, mind a `/hirek` oldalon |
| Hero, Rólunk | szövegek (Rólunk: üres sor = új bekezdés; a számsor elhagyható), képek, álló videó (MP4, max. 50 MB) |
| Lábléc | elérhetőségek (e-mail, telefon, helyszínek), közösségi linkek, alsó sor |
| Form opciók | a „Táncoltál már korábban?” mező opciói |
| Adatkezelés | a tájékoztató sima szövegként (`# cím`, `- felsorolás`, üres sor = új bekezdés) |
| Adminok | ki léphet be |

Képfeltöltéskor a böngésző WebP-re alakítja és max. 1600 px-re kicsinyíti a képet.
Minden mentés azonnal megjelenik a publikus oldalon.

## 5. Felépítés

```
app/(site)/            publikus főoldal
app/(legal)/           adatkezelési tájékoztató, hírek (/hirek, /hirek/[slug])
app/(admin)/admin/     admin (belepes + (panel)/…)
app/actions/           Server Actionök: admin.ts (szerkesztés), auth.ts (belépés),
                       applications.ts (jelentkezés beküldése)
components/            publikus szekciók · components/admin/ = admin UI
lib/content.ts         a publikus tartalom olvasása (gyorsítótár: "site-content" tag)
lib/admin-data.ts      admin írás/olvasás, edit_log, régi fájlok törlése
lib/news-html.ts       a hírek HTML-jének megtisztítása mentéskor
lib/auth.ts            admin jogosultság (Supabase user + undercover.admins)
proxy.ts               admin subdomain + munkamenet frissítés
supabase/              SQL séma + kezdő tartalom
```

### Jelentkezések

A form szerveroldalon is validál, rejtett csapdamezővel és IP-nkénti korláttal
(5 / óra) védekezik a spam ellen, az órák leírását az adatbázisból állítja össze, majd
ment és (a válasz után) e-mailt küld.
