-- =====================================================================
--  Under Cover — a 3 hír eredeti szövege (2026-10-22)
--  Akkor futtasd, ha a 2026-10-22-tartalom.sql-t MÁR lefuttattad.
--  Csak ezt a 3 hírt írja felül (webcím alapján); újrafuttatható.
-- =====================================================================

update undercover.news set
  excerpt = 'Új tanárral és két új csoporttal bővül az Under Cover órarendje: kezdő tini csoport és 16+ K-pop csoport Gyöngyivel.',
  body_html = $html$<p>Sziasztok K-pop Rajongók! Új tanárral és két új csoporttal bővül az Under Cover órarendje!</p>
<p><strong>Gyöngyi</strong> a kezdő tiniket és az idősebb K-pop fanokat is várja, rengeteg energiával, jó hangulattal és a kedvenc K-pop koreóitokkal!</p>
<p>Csajos és srácos táncok vegyesen, pörgős zenék és felszabadult hangulat – itt biztosan nem lesz hiány a jó vibe-okból!</p>
<h2>Órák időpontjai</h2>
<ul>
<li><strong>Kezdő tini csoport:</strong> hétfő és kedd, 17:00–18:00</li>
<li><strong>K-pop csoport (16+):</strong> kedd és csütörtök, 19:00–20:00</li>
</ul>
<p><strong>Helyszín:</strong> Under Cover K-pop Tánciskola<br><strong>Jelentkezés:</strong> <a href="/#orarend">az órarendünkben</a></p>
<p>Válaszd ki a hozzád illő csoportot, és csapj le a helyedre! Várunk szeretettel!</p>$html$,
  updated_at = now()
where slug = 'ket-uj-k-pop-csoport-indul-gyongyivel';

update undercover.news set
  excerpt = '7 éves kortól várunk minden gyereket, aki szereti a K-pop zenét — kezdőket is, a jelentkezés folyamatos.',
  body_html = $html$<p>Sziasztok K-pop rajongók!</p>
<p>Örömmel jelentjük be, hogy elindult K-pop tánc gyerekcsoportunk az Under Covernél! A csoportba <strong>7 éves kortól</strong> várunk minden gyereket, aki szereti a K-pop zenét, szívesen táncolna a kedvenc előadói dalaira, és szeretne egy vidám, támogató közösséghez tartozni.</p>
<p>Az órákon népszerű K-pop koreográfiákat tanulunk, miközben a gyerekek játékosan fejleszthetik ritmusérzéküket, koordinációjukat és tánctudásukat. Természetesen a jó hangulat, a közös élmények és a tánc szeretete sem maradhat el!</p>
<p>Kezdőket is szeretettel várunk, így akkor is bátran lehet csatlakozni, ha gyermeked még soha nem járt táncórára. A legfontosabb a lelkesedés és a K-pop iránti szeretet! A jelentkezés folyamatos, így év közben is van lehetőség csatlakozni a csoporthoz.</p>
<p><strong>Helyszín:</strong> Under Cover K-pop Tánciskola, 1065 Budapest, Hajós utca 1. – az Opera metrómegállótól néhány perc sétára</p>
<p>Ha gyermeked otthon már most is a kedvenc K-pop dalaira táncol, itt az alkalom, hogy egy igazi K-pop táncórán is kipróbálja magát!</p>
<p>Várunk minden 7 éves vagy idősebb K-pop rajongót! Találkozunk a táncteremben!</p>
<p>Üdv,<br>UC Team</p>$html$,
  updated_at = now()
where slug = 'elindult-k-pop-tanc-gyerekcsoportunk';

update undercover.news set
  excerpt = 'Szeptember 7-én indul az új tanév! A beiratkozás minden régi és új tanulónk számára szükséges.',
  body_html = $html$<p>Sziasztok Under Cover Táncosok!</p>
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
<p>Üdv,<br>UC Team</p>$html$,
  updated_at = now()
where slug = 'indul-a-2026-os-k-pop-tancos-tanev';
