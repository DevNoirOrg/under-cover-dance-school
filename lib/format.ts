const MONTHS = ["JAN", "FEB", "MÁR", "ÁPR", "MÁJ", "JÚN", "JÚL", "AUG", "SZEP", "OKT", "NOV", "DEC"];

/** "2026-05-12" → "2026. MÁJ 12" (a hírkártyák dátumformátuma). */
export function newsDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${y}. ${MONTHS[m - 1]} ${d}`;
}

/**
 * A jelentkezésbe kerülő teljes óraleírás:
 * "Közepes terem · Hétfő · Szerda · 16:00–17:00 · Kezdő Tini K-pop — Jula · 12+".
 */
export function classFullLabel(roomName: string, columnHeading: string, title: string, subtitle: string): string {
  const head = [roomName, columnHeading, title].filter((x) => x.trim()).join(" · ");
  return subtitle.trim() ? `${head} — ${subtitle}` : head;
}

/** Kép/videó címe: "/..." = a public mappából, egyébként a Supabase Storage-ból. */
export function mediaUrl(path: string): string {
  if (path.startsWith("/") || path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/undercover/${path}`;
}
