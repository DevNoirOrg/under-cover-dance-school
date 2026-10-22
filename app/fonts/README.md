# Betűtípusok

Saját domainről kiszolgált (self-hosted) Google-betűk, `next/font/local`-lal
betöltve (`app/fonts.ts`). Csak a design által ténylegesen betöltött
vastagságok vannak itt, latin + latin-ext (ő, ű) karakterkészlettel — ugyanazok
a tartományok, mint amiket a Google Fonts kiszolgál:

- Hanken Grotesk 400–800 (alap szövegtípus, `font-sans`)
- Montserrat 400–900 (címek, `font-title`)
- JetBrains Mono 400–600 (`font-mono`; a design sem tölt be 700-at, ezért
  a `font-bold` itt is a 600-as vastagságot kapja)

Mindhárom a SIL Open Font License 1.1 alatt érhető el
(https://openfontlicense.org), ami a weboldalba ágyazást megengedi.
