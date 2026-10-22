import "server-only";
import sanitizeHtml from "sanitize-html";

/*
  A hírek szövegét az admin WYSIWYG szerkesztője HTML-ként küldi. Mentés
  előtt itt megtisztítjuk: csak a szerkesztő által használt elemek és
  attribútumok maradnak (nincs script, style, eseménykezelő stb.).
*/

const STORAGE_MARKER = "/storage/v1/object/public/undercover/";

export function sanitizeNewsHtml(html: string): string {
  const clean = sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "h2", "h3", "ul", "ol", "li", "blockquote", "a", "img", "hr"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https", "http"] },
    allowProtocolRelative: false,
    transformTags: {
      b: "strong",
      i: "em",
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//i.test(href);
        const out: Record<string, string> = { href };
        if (external) Object.assign(out, { target: "_blank", rel: "noopener noreferrer" });
        return { tagName, attribs: out };
      },
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  });
  // üres szerkesztő → üres szöveg
  return clean.replace(/^(\s*<p>\s*<\/p>\s*)+$/, "").trim();
}

/** A szövegbe feltöltött (Supabase Storage) képek útvonalai, pl. "images/2026/….webp". */
export function bodyMediaPaths(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const i = m[1].indexOf(STORAGE_MARKER);
    if (i >= 0) out.push(decodeURIComponent(m[1].slice(i + STORAGE_MARKER.length)));
  }
  return out;
}
