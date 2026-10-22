/*
  Az adatkezelési tájékoztató sima szövegként van tárolva. Három egyszerű
  szabály alakítja oldallá:
    - üres sor        → új bekezdés
    - "# Cím"         → fejezetcím (ebből készül a tartalomjegyzék is)
    - "- elem" sorok  → felsorolás
  Az első fejezetcím előtti szöveg kiemelt dobozban jelenik meg az oldal tetején.
*/

export type PrivacyBlock = { type: "p"; lines: string[] } | { type: "ul"; items: string[] };

export type PrivacySection = { id: string; title: string; blocks: PrivacyBlock[] };

export type ParsedPrivacy = { intro: PrivacyBlock[]; sections: PrivacySection[] };

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "fejezet"
  );
}

export function parsePrivacyText(text: string): ParsedPrivacy {
  const intro: PrivacyBlock[] = [];
  const sections: PrivacySection[] = [];
  const used = new Set<string>();

  const chunks = text.replace(/\r\n?/g, "\n").split(/\n\s*\n/);
  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // Fejezetcím (akár egy blokk első sora is lehet)
    while (lines.length && lines[0].startsWith("#")) {
      const title = lines.shift()!.replace(/^#+\s*/, "");
      let id = slugify(title);
      let n = 2;
      while (used.has(id)) id = `${slugify(title)}-${n++}`;
      used.add(id);
      sections.push({ id, title, blocks: [] });
    }
    if (lines.length === 0) continue;

    const target = sections.length ? sections[sections.length - 1].blocks : intro;
    // felsorolás és bekezdés váltakozhat egy blokkon belül is
    let para: string[] = [];
    let list: string[] = [];
    const flush = () => {
      if (para.length) target.push({ type: "p", lines: para });
      if (list.length) target.push({ type: "ul", items: list });
      para = [];
      list = [];
    };
    for (const line of lines) {
      if (/^[-–•]\s+/.test(line)) {
        if (para.length) {
          target.push({ type: "p", lines: para });
          para = [];
        }
        list.push(line.replace(/^[-–•]\s+/, ""));
      } else {
        if (list.length) {
          target.push({ type: "ul", items: list });
          list = [];
        }
        para.push(line);
      }
    }
    flush();
  }
  return { intro, sections };
}
