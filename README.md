# Under Cover — K-pop Dance Academy

Next.js (App Router) + TypeScript + Tailwind CSS v4 weboldal. A kinézet 1:1 a
`md designs/under_cover_18` design (18.html + adatkezeles.html) alapján készült.

## Futtatás

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # éles build
npm run lint
```

## Oldalak

| Útvonal        | Fájl                                   |
| -------------- | -------------------------------------- |
| `/`            | `app/(site)/page.tsx`                  |
| `/adatkezeles` | `app/(legal)/adatkezeles/page.tsx`     |

A két oldalnak külön gyökér-layoutja van (`app/(site)/layout.tsx`,
`app/(legal)/layout.tsx`), mert a designban más a `<body>` háttere.

## Tartalom szerkesztése (`data/`)

| Fájl               | Mi van benne                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `data/site.ts`     | hero szöveg, gombok, **`heroVideoSrc`**, "Kik vagyunk?", lábléc     |
| `data/schedule.ts` | órarend termenként (Nagy / Közepes terem), órák                     |
| `data/news.ts`     | hírek (opcionális `imageSrc`, amíg nincs: helyőrző)                 |
| `data/prices.ts`   | árak és a kiegészítő megjegyzések                                   |
| `data/form.ts`     | a jelentkezési form legördülő mezőinek opciói                       |
| `data/privacy.tsx` | az adatkezelési tájékoztató szövege (MINTA — a sárga részek ellenőrizendők) |

Képek / videók a `public/` mappába kerülnek, és `/fajlnev.kiterjesztes`
alakban hivatkozhatók (pl. `heroVideoSrc: "/hero.mp4"`).

## Jelentkezés beküldése

Most **demó**: a form validál, összegzi az adatokat és megköszöni a
jelentkezést, de nem küld el semmit. A valódi beküldés helye:
`lib/application.ts` → `submitApplication()`.

## Felépítés

- `components/` — szekciónként egy komponens. Az interaktív részek
  (`LogoMark`, `Schedule`, `Signup`, `MobileDock`, `selection.tsx`) kliens-
  komponensek; a kiválasztott órák közös állapota a `SelectionProvider`-ben van.
- `app/globals.css` — Tailwind v4 `@theme` tokenek + a design saját CSS-e
  változtatás nélkül.
- `app/fonts.ts`, `app/fonts/` — self-hosted betűtípusok (`next/font/local`),
  lásd `app/fonts/README.md`.
- `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png` — favicon és
  megosztási kép.

## Vercel

Nincs szükség extra beállításra. Opcionálisan a `NEXT_PUBLIC_SITE_URL`
környezeti változóval megadható az oldal végleges címe (pl.
`https://undercover.hu`) — enélkül a Vercel production domainjét használja a
megosztási képekhez.
