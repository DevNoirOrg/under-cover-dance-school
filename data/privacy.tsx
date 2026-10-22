import type { ReactNode } from "react";

/*
  Adatkezelési tájékoztató — MINTA (az MD tájékoztatója alapján, az Under
  Cover jelentkezési űrlapjára szabva). A <Check> közé tett adatokat
  véglegesítés előtt ellenőrizni kell (az oldalon sárgával jelennek meg).

  Egy fejezet: id (horgony), tocTitle (tartalomjegyzék), title (címsor),
  body (a tartalom). A sorszámot az oldal automatikusan adja.
*/

/** Ellenőrizendő adat — sárga kiemeléssel jelenik meg. */
export function Check({ children }: { children: ReactNode }) {
  return <span className="check">{children}</span>;
}

/** Kétoszlopos adattábla (bal: címke, jobb: érték). */
export function DataTable({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <table className="data-table">
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={i}>
            <th>{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const privacyIntro = {
  eyebrow: "Under Cover Dance Academy",
  title: "Adatkezelési tájékoztató",
  notice:
    "MINTA — a sárgával jelölt adatokat (adatkezelő, weboldal, elérhetőségek, adatfeldolgozók) véglegesítés előtt ellenőrizni kell.",
};

export type PrivacySection = {
  id: string;
  tocTitle: string;
  title: string;
  body: ReactNode;
};

export const privacySections: PrivacySection[] = [
  {
    id: "cel",
    tocTitle: "A tájékoztató célja, hatálya",
    title: "A tájékoztató célja, hatálya, irányadó jogszabályok",
    body: (
      <>
        <p>
          Jelen tájékoztató célja, hogy rögzítse az adatkezelő által alkalmazott adatvédelmi és adatkezelési elveket,
          valamint az adatkezelő adatvédelmi és adatkezelési politikáját, amelyet magára nézve kötelezőnek ismer el. A
          tájékoztató az <Check>[undercover.hu]</Check> weboldalon keresztül megvalósuló adatkezelésekre — elsősorban a
          táncórákra történő jelentkezésre — vonatkozik, és visszavonásig érvényes.
        </p>
        <p>Az adatkezelés során az adatkezelő az alábbi jogszabályok szerint jár el:</p>
        <ul>
          <li>
            az Európai Parlament és a Tanács (EU) 2016/679 rendelete (általános adatvédelmi rendelet,{" "}
            <strong>GDPR</strong>);
          </li>
          <li>
            az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény (
            <strong>Infotv.</strong>);
          </li>
          <li>
            a Polgári Törvénykönyvről szóló 2013. évi V. törvény (<strong>Ptk.</strong>);
          </li>
          <li>
            a gazdasági reklámtevékenység alapvető feltételeiről és egyes korlátairól szóló 2008. évi XLVIII. törvény (
            <strong>Grtv.</strong>).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "adatkezelo",
    tocTitle: "Az adatkezelő",
    title: "Az adatkezelő",
    body: (
      <DataTable
        rows={[
          ["Név", <Check key="v">Xoa98 Kft.</Check>],
          ["Székhely", <Check key="v">1115 Budapest, Tétényi út 10/c.</Check>],
          ["Adószám", <Check key="v">12372845-2-43</Check>],
          ["E-mail", <Check key="v">masterdancetanciskola@gmail.com</Check>],
          ["Telefon", <Check key="v">+36 (30) 633-6682</Check>],
          ["Adatvédelmi felelős", <Check key="v">Tran Ba Duy Phuong</Check>],
          ["Weboldal", <Check key="v">[undercover.hu]</Check>],
        ]}
      />
    ),
  },
  {
    id: "fogalmak",
    tocTitle: "Fogalmak",
    title: "Fogalmak",
    body: (
      <ul>
        <li>
          <strong>Személyes adat:</strong> azonosított vagy azonosítható természetes személyre (érintett) vonatkozó
          bármely információ.
        </li>
        <li>
          <strong>Adatkezelés:</strong> a személyes adatokon végzett bármely művelet — gyűjtés, rögzítés, tárolás,
          felhasználás, továbbítás, törlés stb.
        </li>
        <li>
          <strong>Adatkezelő:</strong> aki a személyes adatok kezelésének céljait és eszközeit meghatározza.
        </li>
        <li>
          <strong>Adatfeldolgozó:</strong> aki az adatkezelő nevében személyes adatokat kezel.
        </li>
        <li>
          <strong>Hozzájárulás:</strong> az érintett akaratának önkéntes, konkrét, tájékoztatáson alapuló és egyértelmű
          kinyilvánítása.
        </li>
        <li>
          <strong>Adatvédelmi incidens:</strong> a biztonság olyan sérülése, amely a személyes adatok véletlen vagy
          jogellenes megsemmisítését, elvesztését, módosítását, jogosulatlan közlését vagy az azokhoz való jogosulatlan
          hozzáférést eredményezi.
        </li>
      </ul>
    ),
  },
  {
    id: "elvek",
    tocTitle: "Az adatkezelés elvei",
    title: "Az adatkezelés elvei",
    body: (
      <>
        <p>A személyes adatok kezelése során az adatkezelő gondoskodik arról, hogy az adatok:</p>
        <ul>
          <li>kezelése jogszerű, tisztességes és az érintett számára átlátható legyen;</li>
          <li>gyűjtése csak meghatározott, egyértelmű és jogszerű célból történjen (célhoz kötöttség);</li>
          <li>a cél szempontjából megfelelőek, relevánsak és szükségesek legyenek (adattakarékosság);</li>
          <li>pontosak és szükség esetén naprakészek legyenek;</li>
          <li>tárolása csak a cél eléréséhez szükséges ideig történjen;</li>
          <li>megfelelő biztonságát technikai és szervezési intézkedésekkel biztosítsa.</li>
        </ul>
        <p>Az adatkezelő felelős ezen elvek betartásáért, és képes annak igazolására (elszámoltathatóság).</p>
      </>
    ),
  },
  {
    id: "adatok",
    tocTitle: "A kezelt adatok köre és célja",
    title: "A kezelt adatok köre és az adatkezelés célja",
    body: (
      <>
        <h3>Táncórára jelentkezés</h3>
        <DataTable
          rows={[
            [
              "Kezelt adatok",
              "vezetéknév, keresztnév, e-mail cím, születési dátum, a választott órák (nap, időpont, helyszín), korábbi tánctapasztalat, a kezdés tervezett ideje, a megjegyzés mezőben önként megadott adatok",
            ],
            ["16 év alatti jelentkezőnél", "a szülő / törvényes képviselő neve és e-mail címe"],
            [
              "Cél",
              "a jelentkezés fogadása, a jelentkezővel (illetve szülőjével) való kapcsolattartás, a csoportba sorolás és az órák szervezése",
            ],
            ["Jogalap", "az érintett önkéntes hozzájárulása — GDPR 6. cikk (1) bek. a) pont"],
            ["Időtartam", "az utolsó kapcsolatfelvételtől számított 1 év, vagy a hozzájárulás visszavonásáig"],
          ]}
        />
        <p>
          16 év alatti jelentkező esetén a hozzájárulást a szülői felügyeletet gyakorló személy adja meg, ezért az űrlap
          ilyenkor a szülő adatait is kéri.
        </p>

        <h3>Kapcsolatfelvétel (e-mail, telefon, közösségi média)</h3>
        <DataTable
          rows={[
            ["Kezelt adatok", "név, e-mail cím, telefonszám, az üzenetben megadott adatok"],
            ["Cél", "a megkeresések megválaszolása, kapcsolattartás"],
            ["Jogalap", "az érintett önkéntes hozzájárulása — GDPR 6. cikk (1) bek. a) pont"],
            ["Időtartam", "az utolsó kapcsolatfelvételtől számított 1 év, vagy a hozzájárulás visszavonásáig"],
          ]}
        />
      </>
    ),
  },
  {
    id: "mod",
    tocTitle: "Az adatkezelés módja",
    title: "Az adatkezelés módja",
    body: (
      <p>
        Az adatokat az érintett maga adja meg a weboldal jelentkezési űrlapján. Az adatkezelő az adatokat elektronikus
        úton kezeli, azokat csak a fenti célokra használja fel, és nem hoz kizárólag automatizált adatkezelésen alapuló
        döntést. A jelentkezés a „Hozzájárulok…” jelölőnégyzet bepipálásával és az űrlap elküldésével történik; pipa
        nélkül a jelentkezés nem küldhető el.
      </p>
    ),
  },
  {
    id: "cookie",
    tocTitle: "Technikai adatok és sütik",
    title: "Technikai adatok és sütik (cookie-k)",
    body: (
      <p>
        A weboldal a működéshez szükséges, a felhasználói élményt javító, valamint statisztikai célú sütiket használhat. A
        statisztikai sütik (pl. Google Analytics, „_ga”) összesített, személyes azonosításra nem alkalmas adatokat
        gyűjtenek a látogatottságról. A sütik a böngésző beállításaiban bármikor törölhetők vagy letilthatók; ez a
        weboldal egyes funkcióinak működését befolyásolhatja.
      </p>
    ),
  },
  {
    id: "tovabbitas",
    tocTitle: "Adattovábbítás",
    title: "Adattovábbítás",
    body: (
      <p>
        Az adatkezelő a személyes adatokat harmadik fél részére csak az érintett előzetes hozzájárulásával vagy
        jogszabályi kötelezettség alapján (pl. hatósági megkeresésre) továbbítja.
      </p>
    ),
  },
  {
    id: "adatfeldolgozok",
    tocTitle: "Adatfeldolgozók",
    title: "Adatfeldolgozók",
    body: (
      <DataTable
        rows={[
          [
            "Tárhelyszolgáltató",
            <>
              <Check>Rackforest Kft.</Check> — 1132 Budapest, Victor Hugo u. 18–22.
            </>,
          ],
          ["Weboldal karbantartás, adatmentés", <Check key="v">[a fejlesztő / üzemeltető neve, címe]</Check>],
          [
            "Látogatottság-mérés",
            "Google Ireland Ltd. — Gordon House, Barrow Street, Dublin 4, Írország (Google Analytics)",
          ],
        ]}
      />
    ),
  },
  {
    id: "kulso",
    tocTitle: "Külső szolgáltatók",
    title: "Külső szolgáltatók",
    body: (
      <p>
        A weboldal hivatkozásokat tartalmazhat közösségi média felületekre (Instagram, TikTok, YouTube) és beágyazott
        tartalmakat (pl. videó, térkép) jeleníthet meg. Ezeken a felületeken az adott szolgáltató saját adatkezelési
        szabályzata az irányadó.
      </p>
    ),
  },
  {
    id: "biztonsag",
    tocTitle: "Adatbiztonság",
    title: "Adatbiztonság, az adatok megismerése",
    body: (
      <p>
        Az adatkezelő megfelelő technikai és szervezési intézkedésekkel védi az adatokat a jogosulatlan hozzáférés,
        megváltoztatás, továbbítás, nyilvánosságra hozatal, törlés vagy megsemmisülés ellen. Az adatokhoz csak az
        adatkezelő erre feljogosított munkatársai, illetve oktatói férhetnek hozzá, kizárólag a fenti célok érdekében.
      </p>
    ),
  },
  {
    id: "idotartam",
    tocTitle: "Az adatkezelés időtartama",
    title: "Az adatkezelés időtartama, törlés",
    body: (
      <p>
        A személyes adatokat az adatkezelő az 5. pontban megjelölt ideig kezeli. Az adatokat törli, ha kezelésük
        jogellenes, az adatkezelés célja megszűnt, a tárolási idő lejárt, az érintett visszavonja a hozzájárulását vagy
        törlést kér, illetve ha ezt bíróság vagy hatóság elrendeli.
      </p>
    ),
  },
  {
    id: "jogok",
    tocTitle: "Az érintett jogai",
    title: "Az érintett jogai",
    body: (
      <>
        <ul>
          <li>
            <strong>Tájékoztatás és hozzáférés:</strong> tájékoztatást kérhet a róla kezelt adatokról.
          </li>
          <li>
            <strong>Helyesbítés:</strong> kérheti a pontatlan adatok javítását.
          </li>
          <li>
            <strong>Törlés („elfeledtetés”):</strong> kérheti adatai törlését.
          </li>
          <li>
            <strong>Korlátozás:</strong> kérheti az adatkezelés korlátozását.
          </li>
          <li>
            <strong>Tiltakozás:</strong> tiltakozhat személyes adatainak kezelése ellen.
          </li>
          <li>
            <strong>Adathordozhatóság:</strong> kérheti adatai tagolt, géppel olvasható formában történő kiadását.
          </li>
          <li>
            <strong>A hozzájárulás visszavonása:</strong> hozzájárulását bármikor visszavonhatja; ez nem érinti a
            visszavonás előtti adatkezelés jogszerűségét.
          </li>
        </ul>
        <p>
          Kérelmét postai úton vagy e-mailben (<Check>masterdancetanciskola@gmail.com</Check>) nyújthatja be. Az
          adatkezelő a kérelemre legkésőbb egy hónapon belül válaszol; ez a határidő indokolt esetben további két hónappal
          meghosszabbítható, amiről az érintettet tájékoztatja.
        </p>
      </>
    ),
  },
  {
    id: "jogorvoslat",
    tocTitle: "Jogorvoslat",
    title: "Jogorvoslati lehetőségek",
    body: (
      <>
        <p>
          Ha úgy érzi, hogy személyes adatainak kezelése sérti a jogait, kérjük, először forduljon közvetlenül az
          adatkezelőhöz. Panaszával a felügyeleti hatósághoz is fordulhat:
        </p>
        <DataTable
          rows={[
            ["Hatóság", "Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)"],
            ["Cím", "1055 Budapest, Falk Miksa utca 9–11."],
            ["Telefon", "+36 (1) 391-1400"],
            ["E-mail", "ugyfelszolgalat@naih.hu"],
            [
              "Weboldal",
              <a key="v" href="https://naih.hu" target="_blank" rel="noopener">
                naih.hu
              </a>,
            ],
          ]}
        />
        <p>
          Jogainak megsértése esetén bírósághoz is fordulhat; a per — az érintett választása szerint — a lakóhelye vagy
          tartózkodási helye szerinti törvényszék előtt is megindítható.
        </p>
      </>
    ),
  },
];
